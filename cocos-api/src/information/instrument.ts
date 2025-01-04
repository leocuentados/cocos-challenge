export class Instrument {
    id: string;
    ticker: string;
    name: string;
    type: string;

    constructor(id: string, ticker: string, name: string, type: string) {
        this.id = id;
        this.ticker = ticker;
        this.name = name;
        this.type = type;
    }
}