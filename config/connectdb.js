import mysql from "mysql";
import config from "./config";


const db = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.databasename
});

export default db;