import { Pool } from "pg";
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
        let data = await this.query(query, values);
        return new DataFile(finalTableName, data.rows);
    }
    
    public async select(table: string, wheres: {}, fields: [] = []): Promise<DataFile> {
        let columns = fields.length > 0 ? fields.join(",") : "*";
        let keys = Object.keys(wheres);
        let query = `SELECT ${columns} FROM ${table} WHERE ${keys[0]} = $${1}`;
        for (let i = 1; i < keys.length; i++) { query = `${query} AND ${keys[i]} = $${i + 1}`; }
        let values = Object.values(wheres)? Object.values(wheres) : [];
        let data = await this.query(query, values);
        return new DataFile(table, data.rows);
    }

    public async insert(table: string, object: {}) {
        const insert = this.buildInsert(table, object);
        console.log(insert);
        let data = await this.query(insert.query, insert.values);
        return new DataFile(table, data.rows);
    }

    public async manyInserts(table: string, objects: {}[]) {
        const client = await this.pool.connect();
        const result: any[] = [];
        for (const obj of objects) {
            const insert = this.buildInsert(table, obj);
            const response = await (await client.query(insert.query, insert.values)).rows;
            result.push(response);
        }
        await client.release();
        return new DataFile(table, result);
    }

    private buildInsert(table: string, object: {}) {
        const columns = Object.keys(object).join(", ");
        const values = Object.values(object);
        let query = `INSERT INTO ${table} (${columns}) VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")})`;
        return {query: `${query} RETURNING *`, values: values};
    }

    public async update(table: string, values: {}, wheres: {}) {
        let setKeys = Object.keys(values);
        let wheresKeys = Object.keys(wheres);
        let query = `UPDATE ${table} SET`;
        for  (let i = 0; i < setKeys.length; i++) { query = `${query} ${setKeys[i]} = $${i + 1},`; }
        query = `${query.slice(0, -1)} WHERE ${wheresKeys[0]} = $${setKeys.length + 1}`;
        for (let i = 1; i < wheresKeys.length; i++) { query = `${query} AND ${wheresKeys[i]} = $${i + setKeys.length + 1}`; }
        const data = Object.values(values).concat(Object.values(wheres));
        let result = await this.query(query, data);
        return new DataFile(table, result.rows);
    }

    public async delete(table: string, wheres: {}) {
        let keys = Object.keys(wheres);
        const values = Object.values(wheres);
        let query = `DELETE FROM ${table} WHERE ${keys[0]} = $${values.length + 1}`;
        for (let i = 1; i < keys.length; i++) { query = `${query} AND ${keys[i]} = $${i + values.length + 1}`; }
        let result = await this.query(query, values);
        return new DataFile(table, result.rows);
    }
    
    public async query(query: string, data: unknown[] = []) {
        const client = await this.pool.connect();
        let result = await client.query(query, data);
        await client.release();
        return result;
    }
}