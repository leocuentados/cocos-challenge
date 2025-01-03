import { DataSource } from "typeorm/data-source/DataSource";
import { Test } from "../entities/test";
import dotenv from "dotenv";
dotenv.config();

export const DbInstance = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
})