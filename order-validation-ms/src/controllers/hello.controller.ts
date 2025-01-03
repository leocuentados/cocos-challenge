import { getConnection, Repository } from "typeorm";
import { DbInstance } from "../config/db";
import { Test } from "../entities/test";

export class HelloController {
    private dbInstance: Repository<Test>;

    constructor() {
        this.dbInstance = DbInstance.getRepository(Test)
    }

    helloWorld(holaDto: HelloDto) {
        return {message: `${holaDto.hello} ${holaDto.world}`}
    }
}

interface HelloDto {
    hello: string;
    world: string;
}
