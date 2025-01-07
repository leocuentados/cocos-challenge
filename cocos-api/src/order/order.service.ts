import { SQSClient } from "@aws-sdk/client-sqs";
import { CreateOrderDto } from "./create-order.dto";
import { environment } from "../config/constants";
import { Producer } from "sqs-producer";
import { v4 as uuidv4 } from "uuid";
import { PortfolioService } from "../portfolio/portfolio.service";
import { CustomError } from "../config/exception-handler";
import { InformationService } from "../information/information.service";

export class OrderService {
    private sqsProducer;
    constructor (
        private portfolioService: PortfolioService,
        private informationService: InformationService
    ) {
        this.sqsProducer = Producer.create({
            queueUrl: environment.sqs.order_matching_url,
            region: environment.aws.region,
            sqs: new SQSClient({
              region: environment.aws.region,
              credentials: {
                accessKeyId: environment.aws.access_key_id,
                secretAccessKey: environment.aws.secret_access_key,
              },
              endpoint: environment.sqs.url
            }),
          });
    }

    async createOrder(createOrderDto: CreateOrderDto) {
        const user = await this.informationService.getUserById(createOrderDto.userId);


        if (!user) {
            throw new CustomError(404, new Error(`User ${createOrderDto.userId} does not exists`))
        }

        const portfolio = await this.portfolioService.get(createOrderDto.userId);

        const price = parseInt((await this.informationService.getMarketdata(createOrderDto.instrumentId.toString())).close.toString());

        if (portfolio.canCreateOrder(createOrderDto, price)) {
            return this.sendCreateOrderMessage(
                createOrderDto, 
                portfolio.availableMoneyAmount,
                createOrderDto.side === 'BUY'
                    ? price
                    : portfolio.getInstrument(parseInt(createOrderDto.instrumentId.toString()))!.currentPrice
            );
        } else {
            const badRequestMsg = createOrderDto.type === 'MARKET'
                ? `Cant create order, available money or instrument size is not enough for the requested amount`
                : `Cant create order, available money or instrument size is not enough or limit exceeds or is not enough for operation`
            throw new CustomError(400, new Error(badRequestMsg));
        }
    }

    private async sendMessage(messageBody: string): Promise<any> {
        const res = await this.sqsProducer.send({ id: uuidv4(), body: messageBody });
        console.info(`[OrderService] message sent to order-matching-ms-queue`);
        return res;
    }

    private async sendCreateOrderMessage(createOrderDto: CreateOrderDto, moneyAvailableAmount: number, price: number) {
        const order = {
            userId: createOrderDto.userId,
            instrumentId: createOrderDto.instrumentId,
            size: createOrderDto.size,
            side: createOrderDto.side,
            type: createOrderDto.type,
            price: price*createOrderDto.size,
            limit: createOrderDto.type === 'LIMIT' ? createOrderDto.limit : moneyAvailableAmount
        }
        await this.sendMessage(JSON.stringify({ order: order }))
        return order;
    }
  

}