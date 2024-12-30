import { DataFile } from './data/File';
import { PgDataBase } from './db/SqlDataBase';
const BANCO = new PgDataBase({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "postgres",
    password: "root"
});


async function start() {
    const data = DataFile.retrive("files/public-users/data/29-12-2024_215036690-2.json").content();
    data.forEach((e: any) => {
        console.log(e);
        
    });
    console.log(data);

    // await BANCO.insert('public.users', {
    //     nome: "Testinildo",
    //     email: "t@t.t.com",
    //     senha: "t123",
    //     id: "1"
    // });

    // await BANCO.select('public.users', { id: "1" }, []);

    // await BANCO.update('public.users', { senha: "12345678" }, { id: "1" });

    // await BANCO.select('public.users', { id: "1" }, []);

    // await BANCO.delete('public.users', { id: "1" });
}

start();