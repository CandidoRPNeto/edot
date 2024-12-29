import * as fs from 'fs';
import * as path from 'path';

interface Archive {
    currentFileId: string;
    name:string;
    path: string;
    position:number;
}

interface LogArchive extends Archive {
    message: string;
    quantity: number;
    content: [];
}

class Archive implements Archive {
    path: string;
    static position = 1;
    
    constructor() {
        this.currentFileId = `${getTimeInfo()}-${Archive.position}`;
        this.path = "./files";
        Archive.position += 1;
    }
}

export class DataFile extends Archive {
    constructor(name:string, data: any, type:string = "data") {
        super();
        this.name = name.replace(".","-");
        this.path = `${this.path}/${this.name}/${type}/`;
        if (!fs.existsSync(this.path)) fs.mkdirSync(this.path, { recursive: true });
        fs.writeFileSync(`${this.path}${this.currentFileId}.json`, JSON.stringify(data, null, 2));
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
        this.name = name.replace(".","-");
        this.path = `${this.path}/${type}/${this.name}/data`;
        const dirPath = path.dirname(this.path);
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(`${this.path}/${this.currentFileId}.json`, JSON.stringify(data, null, 2));
    }
}

function getTimeInfo(): string {
    const now = new Date();
    const mili = now.getMilliseconds();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    const day = now.getDate();
    const month = now.getMonth() + 1; 
    const year = now.getFullYear();
    return `${day}-${month}-${year}_${hours}${minutes}${seconds}${mili}`;
}