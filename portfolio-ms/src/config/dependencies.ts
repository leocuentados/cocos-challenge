import { InformationClient } from "../information/information.client";
import { InformationService } from "../information/information.service";
import { Portfolio } from "../portfolio/portfolio";
import { PortfolioCache } from "../portfolio/portfolio-cache";
import { PortfolioQueueListener } from "../portfolio/portfolio-queue.listener";
import { PortfolioController } from "../portfolio/portfolio.controller";
import { PortfolioDDBRepository } from "../portfolio/portfolio.ddb";
import { PortfolioService } from "../portfolio/portfolio.service";
import { INFORMATION_MS_URL, PORTFOLIO_QUEUE_URL, PORTFOLIO_TABLE_NAME, PORTFOLIO_TABLE_PK } from "./constants";

export const portfolioDdbRepository = new PortfolioDDBRepository<PortfolioCache>(
    PORTFOLIO_TABLE_NAME,
    PORTFOLIO_TABLE_PK,
);

export const informationClient = new InformationClient(INFORMATION_MS_URL);

export const informationService = new InformationService(informationClient);

const portfolioService = new PortfolioService(informationService, portfolioDdbRepository);
export const PortfolioControllerInstance = new PortfolioController(portfolioService);
export const PortfolioListenerInstance = new PortfolioQueueListener(PORTFOLIO_QUEUE_URL, portfolioService);

