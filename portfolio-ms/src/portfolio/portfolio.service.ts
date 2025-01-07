import { createCustomError } from "../config/exception-handler";
import { InformationService } from "../information/information.service";
import { Order } from "../information/order";
import { Portfolio } from "./portfolio";
import { PortfolioCache } from "./portfolio-cache";
import { PortfolioDDBRepository } from "./portfolio.ddb";
import { v4 as uuidv4 } from "uuid";

export class PortfolioService {
    constructor(
        private informationService: InformationService,
        private ddbRepository: PortfolioDDBRepository<PortfolioCache>
    ) {}

    async getPortfolioCache(userId: number): Promise<PortfolioCache | null> {
        const portfolio = await this.ddbRepository.getByUserId(userId) || null;
        
        if (portfolio) {
            portfolio.instruments = portfolio.instruments.map(i => {
                return {
                    instrumentId: parseInt(i.instrumentId.toString()),
                    quantity: parseInt(i.quantity.toString()),
                    originalPrice: parseFloat(i.quantity.toString()),
                }
            })
        }
        
        return portfolio;
    }

    async createOrUpdatePortfolioCache(userIds: number[], orders: Order[]): Promise<void> {
        for (const userId of userIds) {
            let portfolio = await this.getPortfolioCache(userId);

            if (!portfolio) {
                portfolio = {
                    moneyAvailableAmount: 0,
                    userId: userId.toString(),
                    portfolioId: uuidv4(),
                    instruments: []
                }
            }
    
            for (const order of orders.filter(order => parseInt(order.userId.toString()) === userId)) {
                switch (order.side) {
                    case 'CASH_IN': portfolio.moneyAvailableAmount = portfolio.moneyAvailableAmount + (order.size*order.price); break;
                    case 'CASH_OUT': portfolio.moneyAvailableAmount = portfolio.moneyAvailableAmount - (order.size*order.price); break;
                    case 'BUY': {
                        const currentInstrument = portfolio.instruments.find(i => i.instrumentId === order.instrumentId);
                        if (currentInstrument) {
                            currentInstrument.quantity = currentInstrument.quantity + order.size;
                            currentInstrument.originalPrice = (currentInstrument.originalPrice+order.price) / 2;
                            const instrumentIndex = portfolio.instruments.findIndex(i => i.instrumentId === order.instrumentId);
                            portfolio.instruments[instrumentIndex] = currentInstrument;
                        } else {
                            portfolio.instruments.push(
                                {
                                    instrumentId: order.instrumentId,
                                    quantity: order.size,
                                    originalPrice: order.price
                                }
                            )
                        }
                    }; break;
                    case 'SELL': {
                        if (portfolio.instruments.length > 0) {
                            const currentInstrument = portfolio.instruments.find(i => i.instrumentId === order.instrumentId)!;
                            const instrumentIndex = portfolio.instruments.findIndex(i => i.instrumentId === order.instrumentId)!;
                            currentInstrument.quantity = currentInstrument.quantity - order.size;
                            if (currentInstrument.quantity < 1) {
                                portfolio.instruments.splice(instrumentIndex, 1)
                            } else {
                                portfolio.instruments[instrumentIndex] = currentInstrument;
                            }
                        }; break;
                    }
                }
            }
    
            await this.ddbRepository.update(portfolio);
        }
    }

    async get(userId: number): Promise<Portfolio | null> {
        const portfolioCache = await this.ddbRepository.getByUserId(userId);

        if (!portfolioCache) {
           return null;
        }
        
        const marketdata = 
            await this.informationService.queryMarketdata(
                portfolioCache.instruments.map(instrument => instrument.instrumentId)
            );
 
        return new Portfolio(portfolioCache, marketdata);
    }
}