import {PgDataBase} from './db/DBQueue';

console.log('Começamos os trabalhos');


const BANCO = new PgDataBase({
    host : "localhost",
    port : 5432,
    user : "postgres",
    database : "postgres",
    password : "root"
});


BANCO.insert('public."user"',{
    id: "1",
    nome: "Testinildo",
    email: "t@t.t.com",
    senha: "t123"
});