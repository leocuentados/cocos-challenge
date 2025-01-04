import { Axios } from "axios";
import { OrderValidationClient } from "../order/order-validation.client";
import { OrderController } from "../order/order.controller";
import { OrderService } from "../order/order.service";
import { InformationClient } from "../information/information.client";
import { InformationController } from "../information/information.controller";
import { InformationService } from "../information/information.service";
import { PortfolioClient } from "../portfolio/portfolio.client";
import { PortfolioController } from "../portfolio/portfolio.controller";
import { PortfolioService } from "../portfolio/portfolio.service";

const orderValidationClient = new OrderValidationClient(process.env.ORDER_VALIDATION_MS_URL || 'http://localhost:9001/order-validation');
const orderService = new OrderService(orderValidationClient);
export const OrderControllerInstance = new OrderController(orderService);

const portfolioClient = new PortfolioClient(process.env.PORTFOLIO_MS_URL || 'http://localhost:9001/portfolio');
const portfolioService = new PortfolioService(portfolioClient);
export const PortfolioControllerInstance = new PortfolioController(portfolioService);

const informationClient = new InformationClient(process.env.INFORMATION_MS_URL || 'http://localhost:9001/information');
const informationService = new InformationService(informationClient);
export const InformationControllerInstance = new InformationController(informationService);
