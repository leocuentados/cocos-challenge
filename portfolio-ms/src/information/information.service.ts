import { InformationClient } from "./information.client";
import { Marketdata } from "./marketdata";

export class InformationService {
    constructor(private informationClient: InformationClient) {}
    async queryMarketdata(instrumentIds: number[]): Promise<Marketdata[]> {
        return this.informationClient.queryMarketdata(instrumentIds);
    }
}