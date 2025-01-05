export interface PortfolioCache {
    userId: string;
    portfolioId: string;
    moneyAvailableAmount: number;
    instruments: {
        instrumentId: number;
        quantity: number;
        originalPrice: number;
    }[];
}