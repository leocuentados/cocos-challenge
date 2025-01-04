export class Portfolio {
    userId: string;
    portfolioId: string;
    currentPrice: number;
    availableMoneyAmount: number;
    instruments: InstrumentMarketData[];

    constructor(
        userId: string, 
        portfolioId: string, 
        availableMoneyAmount: number, 
        instruments: InstrumentMarketData[]) {
        this.userId = userId;
        this.portfolioId = portfolioId;
        this.availableMoneyAmount = availableMoneyAmount;
        this.instruments = instruments.map(instrument => this.getInstrumentWithCalculatedBalance(instrument));
        this.currentPrice = this.calculateCurrentPrice();
    }

    public getInstrument(instrumentId: string): InstrumentMarketData | null {
        return this.instruments.find(instrument => instrument.instrumentId === instrumentId) || null;
    }

    public getCurrentPrice(): number {
        return this.currentPrice;
    }

    private calculateCurrentPrice(): number {
        return this.instruments.reduce((acc, instrument) => acc + (instrument.quantity * instrument.currentPrice), 0) + this.availableMoneyAmount;
    }

    private getInstrumentWithCalculatedBalance(instrument: InstrumentMarketData): InstrumentMarketData {
        instrument.balance = ((instrument.currentPrice - instrument.originalPrice) / instrument.originalPrice) * 100;
        return instrument;
    }
}

interface InstrumentMarketData { 
    instrumentId: string; 
    quantity: number; 
    originalPrice: number; 
    currentPrice: number; 
    balance?: number;
}