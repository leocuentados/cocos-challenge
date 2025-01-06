import { CreateOrderDto } from "../order/create-order.dto";

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
        currentPrice: number,
        instruments: InstrumentMarketData[]) {
        this.userId = userId;
        this.portfolioId = portfolioId;
        this.availableMoneyAmount = availableMoneyAmount;
        this.instruments = instruments;
        this.currentPrice = currentPrice;
    }

    getInstrument(instrumentId: number): InstrumentMarketData | null {
        return this.instruments.find(i => i.instrumentId === instrumentId) || null
    }

    canCreateOrder(createOrderDto: CreateOrderDto): boolean {
        if (createOrderDto.side === 'BUY') {
            return this.availableMoneyAmount - createOrderDto.price >= 0;
        } else {
            const instrument = this.getInstrument(createOrderDto.instrumentId);
            return !!instrument && instrument.quantity - createOrderDto.size >= 0;
        }
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