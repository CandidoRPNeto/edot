import { Pool, QueryResult } from "pg";
import { DataFile, MessageFile } from "../files_object/File";
import { Messages } from "../tools/Messages";
export interface PGConnectInfo{
    host: string;
    port: number;
    user: string;
    database: string;
    password: string;
}

export class PgDataBase {
    private pool!: Pool;

    constructor(connect: PGConnectInfo) {
        this.pool = new Pool(connect);
    }
    
    public async rawQuerySelect(finalTableName: string, query: string, values: [] = []): Promise<DataFile> {
        const message = Messages.new("RAW QUERY","unkown");
        try {
            message.loading();
            let data = await this.query(query, values);
            message.success();
            return new DataFile(finalTableName, data.rows);
        } catch (error) { 
            message.fail();
            return new DataFile(finalTableName, {message: "Fail to run", error},"data/logs"); 
        }
    }

    public async insert(table: string, object: {}) {
        const insert = this.buildInsert(table, object);
        const message = Messages.new("INSERT",table);
        try {
            message.loading();
            let data = await this.query(insert.query, insert.values);
            message.success();
            return new DataFile(table, data.rows,"inserts");   
        } catch (error) { 
            message.fail();
            return new DataFile(table, {message: "Fail to insert", object, error},"inserts/logs"); 
        }
    }

    public async manyInserts(table: string, objects: {}[]) {
        const client = await this.pool.connect();
        const result: any[] = [];
        const message = Messages.new("MANY INSERTS",table);
        let lastObj:any;
        try {
            message.loading();
            await client.query('BEGIN');
            for (const obj of objects) {
                lastObj = obj;
                const insert = this.buildInsert(table, obj);
                const response = await (await client.query(insert.query, insert.values)).rows;
                result.push(response);
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            message.fail();
            new DataFile(table, {message: "Fail to insert", lastObj, error},"inserts/logs"); 
        }
        message.success();
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
        const message = Messages.new("SELECT",table);
        message.loading();
        try {
            let data = await this.query(this.buildSelect(table, Object.keys(wheres), fields), values);
            message.success();
            return new DataFile(table, data.rows);
        } catch (error) { 
            message.fail();
            return new DataFile(table, {message: "Fail to select", error},"inserts/logs"); 
        }   
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
        const message = Messages.new("INSERT",table);
        message.loading();
        try {
            let oldOnes = await this.query(SELECTQUERY, Object.values(wheres));
            await this.query(query, data)
            let newOnes = await this.query(SELECTQUERY, Object.values(wheres));
            message.success();
            return new DataFile(table, {new: newOnes.rows, old: oldOnes.rows},"updates");
        } catch (error) {
            message.fail();
            return new DataFile(table, {message: "Fail to update", query, wheres, values, error},"updates/logs"); 
        }
    }

    public async delete(table: string, wheres: {}) {
        let keys = Object.keys(wheres);
        const values = Object.values(wheres);
        let query = `DELETE FROM ${table} WHERE ${keys[0]} = $${1}`;
        for (let i = 1; i < keys.length; i++) { query = `${query} AND ${keys[i]} = $${i + 1}`; }
        const message = Messages.new("INSERT",table);
        message.loading();
        try {
            let result = await this.query(this.buildSelect(table, keys), values);
            await this.query(query, values);
            message.success();
            return new DataFile(table, result.rows,"deletes");
        } catch (error) { 
            message.fail();
            return new DataFile(table, {message: "Fail to delete", wheres, query, error},"deletes/logs"); 
        }
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
