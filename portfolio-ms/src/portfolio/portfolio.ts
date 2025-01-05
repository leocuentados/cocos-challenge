import { Marketdata } from "../information/marketdata";
import { PortfolioCache } from "./portfolio-cache";

export class Portfolio {
    userId: string;
    portfolioId: string;
    currentPrice: number;
    availableMoneyAmount: number;
    instruments: InstrumentMarketData[];

    constructor(portfolioCache: PortfolioCache, marketdataList: Marketdata[]) {
        this.userId = portfolioCache.userId;
        this.portfolioId = portfolioCache.portfolioId;
        this.availableMoneyAmount = portfolioCache.moneyAvailableAmount;
        this.instruments = portfolioCache.instruments.map(instrument => {
            const marketdata = marketdataList.find(m => m.instrumentId === instrument.instrumentId)!;
            return this.buildInstrumentMarketdata(instrument, marketdata)
        });
        this.currentPrice = this.calculateCurrentPrice();
    }

    public getInstrument(instrumentId: number): InstrumentMarketData | null {
        return this.instruments.find(instrument => instrument.instrumentId === instrumentId) || null;
    }

    public getCurrentPrice(): number {
        return this.currentPrice;
    }

    private calculateCurrentPrice(): number {
        return this.instruments.reduce((acc, instrument) => acc + (instrument.quantity * instrument.currentPrice!), 0) + this.availableMoneyAmount;
    }

    private buildInstrumentMarketdata(instrument: {
        instrumentId: number;
        quantity: number;
        originalPrice: number;
    }, marketdata: Marketdata): InstrumentMarketData {
        return {
            instrumentId: instrument.instrumentId,
            quantity: instrument.quantity,
            originalPrice: instrument.originalPrice,
            currentPrice: marketdata.close,
            previousPrice: marketdata.previousClose,
            balance: ((marketdata.close - instrument.originalPrice) / instrument.originalPrice) * 100,
            dailyBalance: ((marketdata.close - marketdata.previousClose) / marketdata.previousClose) * 100
        };
    } 
}

interface InstrumentMarketData { 
    instrumentId: number; 
    quantity: number; 
    originalPrice: number; 
    currentPrice: number; 
    previousPrice: number;
    balance: number;
    dailyBalance: number;
}