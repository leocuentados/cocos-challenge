import { Portfolio } from "./portfolio";
import { PortfolioService } from "./portfolio.service";

export class PortfolioController {
    constructor (private portfolioService: PortfolioService) {}
    async get(userId: number): Promise<Portfolio | null> {
        return this.portfolioService.get(userId);
    }
}