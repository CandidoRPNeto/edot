import * as fs from 'fs';

interface Archive {
    currentFileId: string;
    name:string;
    path: string;
    type:string;
    position:number;
}

class Archive implements Archive {
    path: string;
    type:string;
    static position = 1;
    
    constructor() {
        this.currentFileId = `${getTimeInfo()}-${Archive.position}`;
        this.path = "./files";
        this.type = "data";
        Archive.position += 1;
    }
}

export class DataFile extends Archive {
    constructor(name:string, data: any, type:string = "data", createFile:boolean = true) {
        super();
        this.name = name.replace(".","-");
        this.path = `${this.path}/${this.name}/${type}/`;
        this.type = type;
        if(!createFile) return;
        console.log("7");
        if (!fs.existsSync(this.path)) fs.mkdirSync(this.path, { recursive: true });
        fs.writeFileSync(`${this.path}${this.currentFileId}.json`, JSON.stringify(data, null, 2));
    }

    public static retrive(path:string):DataFile {
        const pathNames = path.split("/").reverse();
        const df = new DataFile(pathNames[2], {}, pathNames[1], false);
        df.currentFileId = pathNames[0].replace(".json","");
        return df;
    }

    public destroy(){
        fs.unlinkSync(`${this.path}/${this.currentFileId}.json`);
    }

    public content(){
        const content = fs.readFileSync(`${this.path}/${this.currentFileId}.json`, 'utf-8');
        return JSON.parse(content);
    }

    public updateContent(data: any) {
        fs.writeFileSync(`${this.path}/${this.currentFileId}.json`, JSON.stringify(data, null, 2));
    }
}

function getTimeInfo(): string {
    const d = new Date();
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}_${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`;
}