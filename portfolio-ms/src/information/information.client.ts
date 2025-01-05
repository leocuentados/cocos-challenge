import axios from "axios";
import { CustomError } from "../config/exception-handler";
import { Marketdata } from "./marketdata";

export class InformationClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        if (baseUrl === '') {
            throw new CustomError(500, new Error('Information API URL is required'));
        }
        this.baseUrl = baseUrl;
    }

    async queryMarketdata(instrumentIds: number[]): Promise<Marketdata[]> {
        const response = (await axios.post(`${this.baseUrl}/marketdata/query`, { instrumentIds: instrumentIds })).data;
        return response.map(marketdata => {
            return {
                instrumentId: marketdata.instrumentid,
                open: parseFloat(marketdata.open),
                close: parseFloat(marketdata.close),
                high: parseFloat(marketdata.high),
                low: parseFloat(marketdata.low),
                previousClose: parseFloat(marketdata.previousclose),
                date: new Date(marketdata.date)
            };
        });
    };
}