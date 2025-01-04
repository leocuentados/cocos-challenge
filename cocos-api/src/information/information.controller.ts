import { InformationService } from "./information.service";
import { Instrument } from "./instrument";

export class InformationController {
    constructor(private informationService: InformationService) {}
    async searchInstrument(searchParam: string): Promise<Instrument[]> {
        return this.informationService.searchInstrument(searchParam);
    }
}