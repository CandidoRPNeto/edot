import { Pool, QueryResult } from "pg";
import { DataFile, MessageFile } from "../files_object/File";
export interface PGConnectInfo{
    host: string;
    port: number;
    user: string;
    database: string;
    password: string;
}

export class PgDataBase {
    private pool!: Pool;
    private enableTransaction: boolean;

    constructor(connect: PGConnectInfo, enableTransaction: boolean = false) {
        this.pool = new Pool(connect);
        this.enableTransaction = enableTransaction;
    }
    
    public async rawQuerySelect(finalTableName: string, query: string, values: [] = []): Promise<DataFile> {
        Messages.new("RAW QUERY","unkown").loading();
        try {
            let data = await this.query(query, values);
            return new DataFile(finalTableName, data.rows);
        } catch (error) { return new DataFile(finalTableName, {message: "Fail to run", error},"data/logs"); }
    }

    public async insert(table: string, object: {}) {
        const insert = this.buildInsert(table, object);
        Messages.new("INSERT",table).loading();
        try {
            let data = await this.query(insert.query, insert.values);
            return new DataFile(table, data.rows,"inserts");   
        } catch (error) { return new DataFile(table, {message: "Fail to insert", object, error},"inserts/logs"); }
    }

    public async manyInserts(table: string, objects: {}[]) {
        const client = await this.pool.connect();
        const result: any[] = [];
        Messages.new("MANY INSERTS",table).loading();
        let lastObj:any;
        try {
            for (const obj of objects) {
                lastObj = obj;
                const insert = this.buildInsert(table, obj);
                const response = await (await client.query(insert.query, insert.values)).rows;
                result.push(response);
            }
        } catch (error) { new DataFile(table, {message: "Fail to insert", lastObj, error},"inserts/logs"); }       
        await client.release();
        return new DataFile(table, result,"inserts");
    }

    private buildInsert(table: string, object: {}) {
        const columns = Object.keys(object).join(", ");
        const values = Object.values(object);
        let query = `INSERT INTO ${table} (${columns}) VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")})`;
        return {query: `${query} RETURNING *`, values: values};
    }
    
    public async select(table: string, wheres: {}, fields: [] = []): Promise<DataFile> {
        let values = Object.values(wheres)? Object.values(wheres) : [];
        Messages.new("SELECT",table).loading();
        try {
            let data = await this.query(this.buildSelect(table, Object.keys(wheres), fields), values);
            return new DataFile(table, data.rows);
        } catch (error) { return new DataFile(table, {message: "Fail to select", error},"inserts/logs"); }   
    }

    public async update(table: string, values: {}, wheres: {}) {
        let setKeys = Object.keys(values);
        let wheresKeys = Object.keys(wheres);
        let query = `UPDATE ${table} SET`;
        for  (let i = 0; i < setKeys.length; i++) { query = `${query} ${setKeys[i]} = $${i + 1},`; }
        query = `${query.slice(0, -1)} WHERE ${wheresKeys[0]} = $${setKeys.length + 1}`;
        for (let i = 1; i < wheresKeys.length; i++) { query = `${query} AND ${wheresKeys[i]} = $${i + setKeys.length + 1}`; }
        const data = Object.values(values).concat(Object.values(wheres));
        const SELECTQUERY = this.buildSelect(table, wheresKeys);
        Messages.new("UPDATE",table).loading();
        try {
            let oldOnes = await this.query(SELECTQUERY, Object.values(wheres));
            await this.query(query, data)
            let newOnes = await this.query(SELECTQUERY, Object.values(wheres));
            return new DataFile(table, {new: newOnes.rows, old: oldOnes.rows},"updates");
        } catch (error) { return new DataFile(table, {message: "Fail to update", query, wheres, values, error},"updates/logs"); }
    }

    public async delete(table: string, wheres: {}) {
        let keys = Object.keys(wheres);
        const values = Object.values(wheres);
        let query = `DELETE FROM ${table} WHERE ${keys[0]} = $${1}`;
        for (let i = 1; i < keys.length; i++) { query = `${query} AND ${keys[i]} = $${i + 1}`; }
        Messages.new("DELETE",table).loading();
        try {
            let result = await this.query(this.buildSelect(table, keys), values);
            await this.query(query, values)
            return new DataFile(table, result.rows,"deletes");
        } catch (error) { return new DataFile(table, {message: "Fail to delete", wheres, query, error},"deletes/logs"); }
    }

    private buildSelect(table: string, keys: string[], fields: [] = []):string {
        let columns = fields.length > 0 ? fields.join(",") : "*";
        let query = `SELECT ${columns} FROM ${table} WHERE ${keys[0]} = $${1}`;
        for (let i = 1; i < keys.length; i++) { query = `${query} AND ${keys[i]} = $${i + 1}`; }
        return query;
    }
    
    public async query(query: string, data: unknown[] = []) {
        const client = await this.pool.connect();
        let result:QueryResult<any>;
        try { result = await client.query(query, data); } 
        catch (error) { result =  { oid: 0, rows: [], fields: [], command: '', rowCount: 0 }; }
        await client.release();
        return result;
    }
}
export class Messages {
    phase: string | undefined;
    table: string | undefined;

    constructor(phase: string,table: string){
        this.phase = phase;
        this.table = table;
    }

    static new(phase: string,table: string){
        return new Messages(phase, table);
    }

    public loading() {
        console.log(`iniciando a fase de ${this.phase} na tabela ${this.table}`);
    }

    public fail() {
        
    }

    public success() {
        
    }
}