import { Consumer } from "sqs-consumer";
import { PortfolioService } from "./portfolio.service";
import { DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { AWS_REGION, AWS_SQS_ENDPOINT } from "../config/constants";
import { createCustomError } from "../config/exception-handler";
import { Order } from "../information/order";


export class PortfolioQueueListener {
    private sqsClient: SQSClient;
    constructor (private queueUrl: string, private portfolioService: PortfolioService) {
        if (queueUrl === '') {
            throw new Error('Queue URL is required');
        }
        this.sqsClient = new SQSClient({
            region: AWS_REGION, 
            endpoint: AWS_SQS_ENDPOINT,
            credentials: {
              accessKeyId: 'fakeAccessKeyId',
              secretAccessKey: 'fakeSecretAccessKey'
            }
          });
        this.exec();
    }

    private async exec() {
        const listener = Consumer.create({
            queueUrl: this.queueUrl,
            handleMessage: async (message) => this.handleMessage(message, this.sqsClient, this.queueUrl),
            sqs: this.sqsClient,
        });

        listener.on('error', (err) => {
          createCustomError(500, err.message);
        });

        listener.start();
        console.info(`Portfolio Queue listening from ${this.queueUrl}`);
    }

    async handleMessage(message: any, sqsClient: SQSClient, queueUrl: string) {
        const ordersMessage: { orders: Order[] } = JSON.parse(message.Body);

        await this.portfolioService.createOrUpdatePortfolioCache(
            ordersMessage.orders[0].userId,
            ordersMessage.orders
        )
        await this.deleteMessage(message, sqsClient, queueUrl);
    }

    private async deleteMessage(message: any, sqsClient: SQSClient, queueUrl: string) {
        await sqsClient.send(new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle
        }));
    }
}