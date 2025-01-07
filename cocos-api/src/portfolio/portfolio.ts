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

    canCreateOrder(createOrderDto: CreateOrderDto, price: number): boolean {
        let canCreate = true;
        if (createOrderDto.side === 'BUY') {
            canCreate = this.availableMoneyAmount - (price*createOrderDto.size) >= 0;
            if (createOrderDto.type === 'LIMIT') {
                canCreate = canCreate && price*createOrderDto.size < createOrderDto.limit!
            }
        } else {
            const instrument = this.getInstrument(parseInt(createOrderDto.instrumentId.toString()));
            canCreate = !!instrument && instrument.quantity - createOrderDto.size >= 0;
            if (createOrderDto.type === 'LIMIT') {
                canCreate = canCreate && price*createOrderDto.size > createOrderDto.limit!;
            }
        }
        return canCreate;
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