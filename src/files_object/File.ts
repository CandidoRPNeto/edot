import * as fs from 'fs';
import * as path from 'path';

interface Archive {
    title: string;
    path: string;
    haveOveride: boolean;
}

interface LogArchive extends Archive {
    message: string;
    quantity: number;
    content: [];
}

class Archive implements Archive {
    title: string;
    path: string;
    haveOveride: boolean = false;
    
    constructor() {
        this.title = getTimeInfo();
        this.path = "";
        this.haveOveride = false;
    }
}

class DataFile extends Archive {
    constructor(data: []) {
        super();
        this.path = `${this.path}`;
        const dirPath = path.dirname(this.path);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(`${this.path}/${this.title}.json`, JSON.stringify(data, null, 2));
    }

    public getContent(){
        return fs.readFileSync(`${this.path}/${this.title}.json`, 'utf-8');
    }

    public setContent(data: []) {
        if(!this.haveOveride) this.title = getTimeInfo();
        fs.writeFileSync(`${this.path}/${this.title}.json`, JSON.stringify(data, null, 2));
    }

    public setCsvContent(path: string) {
    }

    public disableOveride() {
        this.haveOveride = false; 
    }

    public enableOveride() {
        this.haveOveride = true; 
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