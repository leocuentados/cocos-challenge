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

    async createOrder(createOrderDto: CreateOrderDto): Promise<void> {
        const user = await this.informationService.getUserById(createOrderDto.userId);

        if (!user) {
            throw new CustomError(404, new Error(`User ${createOrderDto.userId} does not exists`))
        }

        const portfolio = await this.portfolioService.get(createOrderDto.userId);

        if (portfolio.canCreateOrder(createOrderDto)) {
            return this.sendCreateOrderMessage(createOrderDto);
        } else {
            throw new CustomError(400, new Error('Cant create order, available money or instrument size is not enough for the requested amount'));
        }
    }

    private sendMessage(messageBody: string): Promise<any> {
        return this.sqsProducer.send({ id: uuidv4(), body: messageBody });
    }

    private sendCreateOrderMessage(createOrderDto: CreateOrderDto) {
        return this.sendMessage(JSON.stringify({
            order: {
                userId: createOrderDto.userId,
                instrumentId: createOrderDto.instrumentId,
                size: createOrderDto.size,
                side: createOrderDto.side,
                type: createOrderDto.type,
                price: createOrderDto.price
            }
        }))
    }
  

}