import {DataSource} from "knex-db-connector";
import {config} from "dotenv";
import {WinstonLoggerService} from "mein-winston-logger";
import {logger} from "./logger.js";

config()
const {
    MYSQL_CONNECTION_STRING,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_DBNAME,
    MYSQL_USER,
    MYSQL_PASSWORD
} = process.env

export const dataSource = new DataSource({
    client: "mysql2",
    connection: {
        host: MYSQL_HOST,
        port: Number(MYSQL_PORT),
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DBNAME
    }
})