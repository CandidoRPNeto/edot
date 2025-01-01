import { Pool, QueryResult } from "pg";
import { DataFile } from "../data/File";

export interface SqlBuilds {
    insert(table: string, object: {}): void;
    select(table: string, wheres: {}, fields: []): Promise<DataFile>;
    update(table: string, values: {}, wheres: {}): void;
    delete(table: string, wheres: {}): void;
}

export class SqlBuilds implements SqlBuilds {
    public static insert(table: string, object: {}) {
        const columns = Object.keys(object).join(", ");
        const values = Object.values(object);
        let query = `INSERT INTO ${table} (${columns}) VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")})`;
        return {query: `${query} RETURNING *`, values: values};
    }

    public static select(table: string, keys: string[], fields: [] = []):string {
        let columns = fields.length > 0 ? fields.join(",") : "*";
        let query = `SELECT ${columns} FROM ${table} WHERE ${keys[0]} = $${1}`;
        for (let i = 1; i < keys.length; i++) { query = `${query} AND ${keys[i]} = $${i + 1}`; }
        return query;
    }

    public static update(table: string, setKeys: string[], wheresKeys: string[]):string {
        let query = `UPDATE ${table} SET`;
        for  (let i = 0; i < setKeys.length; i++) { query = `${query} ${setKeys[i]} = $${i + 1},`; }
        query = `${query.slice(0, -1)} WHERE ${wheresKeys[0]} = $${setKeys.length + 1}`;
        const conector = wheresKeys.every(key => key === wheresKeys[0]) ? "OR" : "AND";
        for (let i = 1; i < wheresKeys.length; i++) { query = `${query} ${conector} ${wheresKeys[i]} = $${i + setKeys.length + 1}`; }     
        return query;
    }

    public static delete(table: string, keys: string[]):string {
        let query = `DELETE FROM ${table} WHERE ${keys[0]} = $${1}`;
        const conector = keys.every(key => key === keys[0]) ? "OR" : "AND";
        for (let i = 1; i < keys.length; i++) { query = `${query} ${conector} ${keys[i]} = $${i + 1}`; }
        return query;
    }
}
