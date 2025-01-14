# Edot

## Index
- [SqlBuilds.ts](#sql-builds)

- [File.ts](#file)


## SqlBuilds.ts (#sql-builds)

The `SqlBuilds.ts` module provides the SqlBuilds class who generate SQL queries.

### Class SqlBuilds
The SqlBuilds class provides utility methods for dynamically creating structured SQL queries, reducing the need to write raw SQL manually.

#### insert
Generates an INSERT query to add a record into the specified table.

##### Parameters
- table (string): The name of the database table.
- object (object): An object where the keys are column names and the values are the respective values to insert.

##### Returns
- An object containing:
- - query (string): The generated SQL query.
- - values (any[]): The values to be used in the query.

##### Usage Example
```typescript
const table = "users";
const data = { name: "John Doe", email: "john.doe@example.com" };
const result = SqlBuilds.insert(table, data);

console.log(result.query);
// INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *
console.log(result.values);
// ["John Doe", "john.doe@example.com"]
```

#### select
Generates a SELECT query to retrieve records from the specified table based on conditions.

##### Parameters
- table (string): The name of the database table.
- keys (string[]): Array of column names to filter on.
- fields (string[]): (Optional) Array of column names to include in the result. Defaults to all columns (*).

##### Usage Example
```typescript
const table = "users";
const keys = ["id", "email"];
const fields = ["name", "email"];
const query = SqlBuilds.select(table, keys, fields);

console.log(query);
// SELECT name, email FROM users WHERE id = $1 AND email = $2
```

#### update
Generates an UPDATE query to modify records in the specified table based on conditions.

##### Parameters
- table (string): The name of the database table.
- setKeys (string[]): Array of column names to update.
- wheresKeys (string[]): Array of column names to filter on.

##### Usage Example
```typescript
const table = "users";
const setKeys = ["name", "email"];
const wheresKeys = ["id"];
const query = SqlBuilds.update(table, setKeys, wheresKeys);

console.log(query);
// UPDATE users SET name = $1, email = $2 WHERE id = $3
```

#### delete
Generates a DELETE query to remove records from the specified table based on conditions.

##### Parameters
- table (string): The name of the database table.
- keys (string[]): Array of column names to filter on.

##### Usage Example
```typescript
const table = "users";
const keys = ["id"];
const query = SqlBuilds.delete(table, keys);

console.log(query);
// DELETE FROM users WHERE id = $1
```

## File.ts {#file}

The `File.ts` module provides the `Archive` interface and the `DataFile` class, designed for managing JSON files in a structured directory.

### Interface `Archive`

The `Archive` interface defines the essential fields to represent a file within the library:

```typescript
interface Archive {
    id: string;
    name: string;
    path: string;
    type: string;
}
```
- id (string): Unique identifier for the file.
- name (string): Name of the file.
- path (string): Path where the file is located.
- type (string): File type, used to organize it into subdirectories.

### Class DataFile
The DataFile class implements the Archive interface and provides methods for creating, retrieving, updating, and deleting JSON files.

#### Constructor
```typescript
constructor(name: string = "query", data: any, type: string = "data", createFile: boolean = true)
```
##### Parameters
- name (string, optional): Base name of the file (default: "query").
- data (any): Initial data to be stored in the JSON file.
- type (string, optional): File type for organizing it into subdirectories (default: "data").
- createFile (boolean, optional): Determines whether the file should be created immediately (default: true).
##### Usage Example
```typescript
import { DataFile } from './File';
const data = { key: "value" };
const file = new DataFile("myFile", data, "example");
// The file will be created at: ./files/myFile/example/<id>.json
```
#### Methods

##### retrive
```typescript
retrive(path: string): DataFile
```
Creates a DataFile instance based on an existing path.
###### Parameters
- path (string): Full path of the JSON file to retrieve.
###### Usage Example
```typescript
const file = DataFile.retrive("./files/myFile/example/12345.json");
console.log(file.id); // "12345"
```
##### destroy
```typescript
destroy(): void
```
Removes the JSON file from the file system.
###### Usage Example
```typescript
file.destroy();
```
##### content
```typescript
content(): any
```
Reads and returns the content of the JSON file.
###### Usage Example
```typescript
const content = file.content();
console.log(content); // { key: "value" }
```

##### updateContent
```typescript
updateContent(data: any): void
```
Updates the content of the JSON file with new data.
###### Parameters
- data (any): New data to be saved in the file.
###### Usage Example
```typescript
file.updateContent({ key: "newValue" });
```

#### Directory Structure
Created files are organized in the following format:
```bash
./files/{name}/{type}/{id}.json
```
- name: Base name of the file.
- type: File type (defined in the constructor).
- id: Automatically generated unique identifier.