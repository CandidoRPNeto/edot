# Edot
This project is a modular and highly structured system designed for efficient data management, SQL query generation, and JSON file handling. The project integrates dynamic messaging, database abstraction layers, and JSON file operations, allowing developers to use TypeScript and its libraries to work on the database.

## Index

- data:
- - [Messages.ts](#messagests)
- - [File.ts](#filets)
- db:
- - [SqlBuilds.ts](#sqlbuildsts)
- - [SqlDatabase.ts](#sqldatabasets)


## Messages.ts
The Messages handles customizable messages that can be dynamically built with variables. This class is often used in conjunction with the SQLDatabases to log messages during database operations, such as loading data, handling errors, and confirming success.

### Interface TypeMessages
This interface defines the structure for the messages passed to the Messages class.

##### Fields
- loading (string): The default message for a loading state.
- fail (string): The default message for a failed operation.
- success (string): The default message for a successful operation.

### Class Messages

The Messages class allows:
- Setting default messages for different states (loading, fail, success).
- Using placeholders in messages (e.g., {key}) that can be replaced with dynamic values.
- Logging the final built messages.

#### constructor
Generates an INSERT query to add a record into the specified table.

##### Parameters
- messages (TypeMessages): An object containing default message templates for loading, fail, and success.

#### setVariables
Sets the variables used to replace placeholders in message templates.

##### Parameters
- variables ({[key: string]: any}): An object where keys represent placeholders and values are the replacements.

##### Usage Example
```typescript
const messages = new Messages({
    loading: "Loading {operation}...",
    fail: "Failed to complete {operation}. Reason: {reason}.",
    success: "{operation} was successful!"
});

messages.setVariables({
    operation: "data fetch",
    reason: "network timeout"
});
```

#### loading
Logs the loading message with variables replaced.

##### Returns
- Messages: The instance of the Messages class for method chaining.

##### Usage Example
```typescript
messages.loading(); 
// Output: "Loading data fetch..."
```

#### fail
Logs the fail message with variables replaced.

##### Returns
- Messages: The instance of the Messages class for method chaining.

##### Usage Example
```typescript
messages.fail(); 
// Output: "Failed to complete data fetch. Reason: network timeout."
```

#### success
Logs the success message with variables replaced.

##### Returns
- Messages: The instance of the Messages class for method chaining.

##### Usage Example
```typescript
messages.success(); 
// Output: "Data fetch was successful!"
```

#### buildMessage
Constructs a message by replacing placeholders with corresponding values from the variables object.

##### Parameters
- message (string): The message template containing placeholders (e.g., {key}).

##### Returns
- string: The final message with all placeholders replaced.

## File.ts

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

## SqlBuilds.ts

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
## SqlDatabase.ts

This file provides a database abstraction layer. It defines interfaces and classes for interacting with multiple types of databases (PostgreSQL, MySql, etc... ) in a structured and efficient way. Each method integrates with the Messages class for consistent logging of loading, success, and failure states.

### Interfaces

### PGConnectInfo
Defines the structure for PostgreSQL connection information.

Fields:
- host (string): The database host.
- port (number): The port number for the database connection.
- user (string): The username for authentication.
- database (string): The database name.
- password (string): The password for authentication.

### SqlDataBase
Defines the contract for database operations.

Methods:
- rawQuerySelect(finalTableName: string, query: string, values: []): Promise<DataFile>
- insert(table: string, object: {}): void
- manyInserts(table: string, objects: {}[]): void
- select(table: string, wheres: {}, fields: []): Promise<DataFile>
- update(table: string, values: {}, wheres: {}): void
- delete(table: string, wheres: {}): void
- query(query: string, data: unknown[]): void

### Classes

### PgDataBase
This class is a PostgreSQL database abstraction layer using the pg library. 

#### constructor
##### Parameters
- connect (PGConnectInfo): The PostgreSQL connection information.
- messages (Messages, optional): An instance of Messages for logging. Defaults to a pre-configured instance.
##### Usage Example
```typescript
const db = new PgDataBase({
    host: "localhost",
    port: 5432,
    user: "user",
    database: "mydb",
    password: "password",
});
```
#### rawQuerySelect
Executes a raw SQL query and wraps the result in a DataFile.
##### Parameters
- finalTableName (string): Logical table name for the resulting data.
- query (string): SQL query to execute.
- values (array): Query parameter values.
##### Usage Example
```typescript
await db.rawQuerySelect("users", "SELECT * FROM users WHERE age > $1", [30]);
```
#### insert
Inserts a single row into a table.
##### Parameters
- table (string): Target table.
- object (object): Row data to insert.
##### Usage Example
```typescript
await db.insert("users", { name: "John", age: 30 });
```
#### manyInserts
Inserts multiple rows into a table in a single transaction.
##### Parameters
- table (string): Target table.
- objects (array of objects): Rows to insert.
##### Usage Example
```typescript
await db.manyInserts("users", [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
]);
```
#### select
Selects rows from a table based on conditions.
##### Parameters
- table (string): Target table.
- wheres (object): Conditions for selection.
- fields (array): Fields to retrieve (optional).
##### Usage Example
```typescript
await db.select("users", { age: 30 }, ["name", "email"]);
```
#### update
Updates rows in a table.
##### Parameters
- table (string): Target table.
- values (object): New values for the update.
- wheres (object): Conditions to match.
##### Usage Example
```typescript
await db.update("users", { age: 31 }, { name: "John" });
```
#### delete
Deletes rows from a table.
##### Parameters
- table (string): Target table.
- wheres (object): Conditions for deletion.
##### Usage Example
```typescript
await db.delete("users", { name: "John" });
```
#### reset
Resets a table to its original state using a DataFile.
##### Parameters
- path (string): Path to the DataFile for the reset operation.
##### Usage Example
```typescript
await db.reset("path/to/datafile.json");
```
#### query
Executes a custom query.
##### Parameters
- query (string): SQL query to execute.
- data (array): Query parameter values.
##### Usage Example
```typescript
await db.query("SELECT * FROM users WHERE age > $1", [30]);
```