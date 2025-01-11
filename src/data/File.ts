import * as fs from 'fs';

interface Archive {
    id: string;
    name:string;
    path: string;
    type:string;
}


export class DataFile implements Archive {
    path: string;
    type:string;
    position = 1;
    id: string;
    name: string;

    constructor(name:string = "query", data: any, type:string = "data", createFile:boolean = true) {
        
        this.id = `${getTimeInfo()}`;
        this.path = "./files";
        this.type = "data";


        this.name = name.replace(".","-");
        this.path = `${this.path}/${this.name}/${type}/`;
        this.type = type;
        if(!createFile) return;
        if (!fs.existsSync(this.path)) fs.mkdirSync(this.path, { recursive: true });
        fs.writeFileSync(`${this.path}${this.id}.json`, JSON.stringify(data, null, 2));
    }

    public static retrive(path:string):DataFile {
        const pathNames = path.split("/").reverse();
        const df = new DataFile(pathNames[2], {}, pathNames[1], false);
        df.id = pathNames[0].replace(".json","");
        return df;
    }

    public destroy(){
        fs.unlinkSync(`${this.path}/${this.id}.json`);
    }

    public content(){
        const content = fs.readFileSync(`${this.path}/${this.id}.json`, 'utf-8');
        return JSON.parse(content);
    }

    public updateContent(data: any) {
        fs.writeFileSync(`${this.path}/${this.id}.json`, JSON.stringify(data, null, 2));
    }
}

function getTimeInfo(): string {
    const d = new Date();
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}_${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`;
}