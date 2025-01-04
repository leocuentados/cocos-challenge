import { Portfolio } from "./portfolio";
import { PortfolioClient } from "./portfolio.client";

export class PortfolioService {
    constructor(private portfolioClient: PortfolioClient) {}
    get(userId: string): Promise<Portfolio> {
        return this.portfolioClient.get(userId);
    }
}