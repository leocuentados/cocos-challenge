import axios from "axios";
import { CustomError } from "../config/exception-handler";
import { Instrument } from "./instrument";
import { User } from "./user";

export class InformationClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        if (baseUrl === '') {
            throw new CustomError(500, new Error('Information API URL is required'));
        }
        this.baseUrl = baseUrl;
    }

    async searchInstrument(searchParam: string): Promise<Instrument[]> {
        const response = (await axios.get(`${this.baseUrl}/instruments/search?searchParam=${searchParam}`)).data;
        return response.length > 0 ? response.map((instrument: any) => new Instrument(
            instrument.id,
            instrument.ticker,
            instrument.name,
            instrument.type
        )) : [];
    }

    async getUserById(userId: number): Promise<User | null> {
        return (await axios.get(`${this.baseUrl}/users/${userId}`)).data
    }
}