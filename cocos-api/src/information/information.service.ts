import { InformationClient } from "./information.client";
import { Instrument } from "./instrument";
import { User } from "./user";

export class InformationService {
    constructor(private informationClient: InformationClient) {}
    async searchInstrument(searchParam: string): Promise<Instrument[]> {
        return this.informationClient.searchInstrument(searchParam);
    }

    getUserById(userId: number): Promise<User | null> {
        return this.informationClient.getUserById(userId);
    }
}