import axios, { AxiosError } from "axios";
import { Portfolio } from "./portfolio";
import { CustomError } from "../config/exception-handler";

export class PortfolioClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        if (baseUrl === '') {
            throw new CustomError(500, new Error('Portfolio API URL is required'));
        }
        this.baseUrl = baseUrl;
    }

    async get(userId: string): Promise<Portfolio> {
        const response = (await axios.get(`${this.baseUrl}/portfolio?userId=${userId}`)).data;
        if (response === null) {
            throw new AxiosError('Portfolio not found', '404');
        }
        return new Portfolio(
            response.userId,
            response.portfolioId,
            response.availableMoneyAmount,
            response.currentPrice,
            response.instruments
        );
    }
}