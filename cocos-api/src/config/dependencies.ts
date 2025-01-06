import { Axios } from "axios";
import { OrderController } from "../order/order.controller";
import { OrderService } from "../order/order.service";
import { InformationClient } from "../information/information.client";
import { InformationController } from "../information/information.controller";
import { InformationService } from "../information/information.service";
import { PortfolioClient } from "../portfolio/portfolio.client";
import { PortfolioController } from "../portfolio/portfolio.controller";
import { PortfolioService } from "../portfolio/portfolio.service";
import { environment } from "./constants";

const informationClient = new InformationClient(environment.api.information);
const informationService = new InformationService(informationClient);
export const InformationControllerInstance = new InformationController(informationService);

const portfolioClient = new PortfolioClient(environment.api.portfolio);
const portfolioService = new PortfolioService(portfolioClient);
export const PortfolioControllerInstance = new PortfolioController(portfolioService);

const orderService = new OrderService(portfolioService, informationService);
export const OrderControllerInstance = new OrderController(orderService);