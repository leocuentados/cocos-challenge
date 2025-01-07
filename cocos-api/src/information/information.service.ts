import { InformationClient } from "./information.client";
import { Instrument } from "./instrument";
import { Marketdata } from "./marketdata";
import { User } from "./user";

export class InformationService {
    constructor(private informationClient: InformationClient) {}
    async searchInstrument(searchParam: string): Promise<Instrument[]> {
        return this.informationClient.searchInstrument(searchParam);
    }

    getUserById(userId: string): Promise<User | null> {
        return this.informationClient.getUserById(userId);
    }

    getMarketdata(instrumentId: string): Promise<Marketdata> {
        return this.informationClient.getMarketdata(instrumentId);
    }
}