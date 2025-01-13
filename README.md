# Edot







## File.ts

Part of the **[Library Name]**, the `File.ts` module provides the `Archive` interface and the `DataFile` class, designed for managing JSON files in a structured directory.

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