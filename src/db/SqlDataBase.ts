import { Pool, QueryResult } from "pg";
import { DataFile } from "../data/File";
import { Messages } from "../data/Messages";
import { SqlBuilds } from "./SqlBuilds";

export interface PGConnectInfo{
    host: string;
    port: number;
    user: string;
    database: string;
    password: string;
}

export interface SqlDataBase {
    rawQuerySelect(finalTableName: string, query: string, values: []): Promise<DataFile>;
    insert(table: string, object: {}): void;
    manyInserts(table: string, objects: {}[]): void;
    select(table: string, wheres: {}, fields: []): Promise<DataFile>;
    update(table: string, values: {}, wheres: {}): void;
    delete(table: string, wheres: {}): void;
    query(query: string, data: unknown[]): void;
}

export class PgDataBase implements SqlDataBase {
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
        const insert = SqlBuilds.insert(table, object);
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
                const insert = SqlBuilds.insert(table, obj);
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
    
    public async select(table: string, wheres: {}, fields: [] = []): Promise<DataFile> {
        let values = Object.values(wheres)? Object.values(wheres) : [];
        const message = Messages.new("SELECT",table);
        message.loading();
        try {
            let data = await this.query(SqlBuilds.select(table, Object.keys(wheres), fields), values);
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
        const query = SqlBuilds.update(table,setKeys,wheresKeys);
        const data = Object.values(values).concat(Object.values(wheres));
        const selectQuery = SqlBuilds.select(table, wheresKeys);
        const message = Messages.new("UPDATE",table);
        message.loading();
        try {
            let oldOnes = await this.query(selectQuery, Object.values(wheres));
            await this.query(query, data)
            let newOnes = await this.query(selectQuery, Object.values(wheres));
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
        let query = SqlBuilds.delete(table,keys);
        const message = Messages.new("DELETE",table);
        message.loading();
        try {
            let result = await this.query(SqlBuilds.select(table, keys), values);
            await this.query(query, values);
            message.success();
            return new DataFile(table, result.rows,"deletes");
        } catch (error) { 
            message.fail();
            return new DataFile(table, {message: "Fail to delete", wheres, query, error},"deletes/logs"); 
        }
    }

    public async reset(path:string) {
        const data = DataFile.retrive(path);
        const content = data.content();
        let values:any = {};
        let query:string = "";

        switch (data.type) {
            case "inserts":
                const wheres = content.map((obj: { id: any; }) => ({ id: obj.id }));
                values = Object.values(wheres);
                query = SqlBuilds.delete(data.name, Object.keys(wheres));
                break;
            case "deletes":
                content.forEach(async (obj: {}) => {
                    const build = SqlBuilds.insert(data.name,obj);
                    values = build.values;
                    query = build.query;
                });
                break;
            case "updates":
                content.old.forEach(async (obj: { id?: any; }) => {
                    query = SqlBuilds.update(data.name, Object.keys(obj), ["id"]);
                    values= Object.values(obj).concat([obj.id]);
                });
                break;
            default:
                return;
        }
        await this.query(query, values);
        data.destroy();
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
