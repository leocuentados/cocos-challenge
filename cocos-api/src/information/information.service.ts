import { InformationClient } from "./information.client";
import { Instrument } from "./instrument";

export class InformationService {
    constructor(private informationClient: InformationClient) {}
    async searchInstrument(searchParam: string): Promise<Instrument[]> {
        return this.informationClient.searchInstrument(searchParam);
    }
}