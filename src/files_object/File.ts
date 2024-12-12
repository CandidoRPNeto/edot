import * as fs from 'fs';
import * as path from 'path';

interface Archive {
    currentFileId: string;
    name:string;
    path: string;
}

interface LogArchive extends Archive {
    message: string;
    quantity: number;
    content: [];
}

class Archive implements Archive {
    path: string;
    
    constructor() {
        this.currentFileId = getTimeInfo();
        this.path = "./files";
    }
}

export class DataFile extends Archive {
    currentFileId: string = "";
    constructor(name:string, data: any[]) {
        super();
        this.name = name;
        this.path = `${this.path}/${this.name}/data`;
        const dirPath = path.dirname(this.path);
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(`${this.path}/${this.currentFileId}.json`, JSON.stringify(data, null, 2));
    }

    public getCopyOfCurrentFileContent(){
        return fs.readFileSync(`${this.path}/${this.currentFileId}.json`, 'utf-8');
    }

    public updateCurrentFileContent(data: []) {
        this.currentFileId = getTimeInfo();
        fs.writeFileSync(`${this.path}/${this.currentFileId}.json`, JSON.stringify(data, null, 2));
    }
}

export class MessageFile extends Archive {
    constructor(name:string, type:string, data: any[]) {
        super();
        this.name = name;
        this.path = `${this.path}/${type}/${this.name}/data`;
        const dirPath = path.dirname(this.path);
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(`${this.path}/${this.currentFileId}.json`, JSON.stringify(data, null, 2));
    }
}

function getTimeInfo(): string {
    const now = new Date(); 
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    const day = now.getDate();
    const month = now.getMonth() + 1; 
    const year = now.getFullYear();
    return `${seconds}_${minutes}${hours}${day}${month}${year}`;
}