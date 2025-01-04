import axios from "axios";
import { CustomError } from "../config/exception-handler";
import { Instrument } from "./instrument";

export class InformationClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        if (baseUrl === '') {
            throw new CustomError(500, new Error('Information API URL is required'));
        }
        this.baseUrl = baseUrl;
    }

    async searchInstrument(searchParam: string): Promise<Instrument[]> {
        const response = (await axios.get(`${this.baseUrl}/instruments/search?=ticker=${searchParam}&name=${searchParam}`)).data;
        return response.instruments.map((instrument: any) => new Instrument(
            instrument.id,
            instrument.ticker,
            instrument.name,
            instrument.type
        ));
    }
}