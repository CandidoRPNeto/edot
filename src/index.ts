import { PgDataBase } from './db/DBQueue';
const BANCO = new PgDataBase({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "postgres",
    password: "root"
});


async function start() {
    await BANCO.insert('public.users', {
        nome: "Testinildo",
        email: "t@t.t.com",
        senha: "t123",
        id: "1"
    });
    await BANCO.insert('public.users', {
        nome: "Testinildo",
        email: "t@t.t.com",
        senha: "t123",
        id: "1"
    });

    // await BANCO.select('public.users', { id: "1" }, []);

    // await BANCO.update('public.users', { senha: "12345678" }, { id: "1" });

    // await BANCO.select('public.users', { id: "1" }, []);

    // await BANCO.delete('public.users', { id: "1" });
}

start();