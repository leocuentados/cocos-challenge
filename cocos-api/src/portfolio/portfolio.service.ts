import { Portfolio } from "./portfolio";
import { PortfolioClient } from "./portfolio.client";

export class PortfolioService {
    constructor(private portfolioClient: PortfolioClient) {}
    get(userId: number): Promise<Portfolio> {
        return this.portfolioClient.get(userId);
    }
}