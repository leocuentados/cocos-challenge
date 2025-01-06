import { Portfolio } from "./portfolio";
import { PortfolioService } from "./portfolio.service";

export class PortfolioController {
    constructor (private portfolioService: PortfolioService) {}
    async get(userId: number): Promise<Portfolio> {
        return this.portfolioService.get(userId);
    }
}