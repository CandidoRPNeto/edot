
export class Messages {
    phase: string | undefined;
    table: string | undefined;

    constructor(phase: string,table: string){
        this.phase = phase;
        this.table = table;
    }

    static new(phase: string,table: string){
        return new Messages(phase, table);
    }

    public loading(): Messages {
        console.log(`iniciando a fase de ${this.phase} na tabela ${this.table}`);
        return this;
    }

    public fail(): Messages {
        return this;
    }

    public success(): Messages {
        return this;
    }
}