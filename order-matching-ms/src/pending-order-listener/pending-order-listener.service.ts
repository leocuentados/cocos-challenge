import { Injectable } from '@nestjs/common';
import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { environment } from 'src/config/constants';
import { Consumer } from 'sqs-consumer';
import { PendingOrderService } from '../pending-order/pending-order.service';
import { OrderCreationMessage } from './order-creation-message';

@Injectable()
export class PendingOrderListenerService {
    private orderMatchingMsQueue: SQSClient;

    constructor(
        private pendingOrderService: PendingOrderService
    ) {
        this.orderMatchingMsQueue = new SQSClient({
            region: environment.aws.region, 
            endpoint: environment.sqs.url,
            credentials: {
              accessKeyId: environment.aws.access_key_id,
              secretAccessKey: environment.aws.secret_access_key
            }
          });
        this.initListener();
    }

    private async initListener() {
        const listener = Consumer.create({
            queueUrl: environment.sqs.order_matching_ms_url,
            handleMessage: async (message) => this.handleListenerMessage(message, this.orderMatchingMsQueue, environment.sqs.url),
            sqs: this.orderMatchingMsQueue,
        });

        listener.on('error', (err) => {
          throw new Error('Unexpected order-matching-ms queue listener error');
        });

        listener.start();
        console.info(`[PendingOrderListenerService] listening from ${environment.sqs.order_matching_ms_url}`);
    }

    private async handleListenerMessage(message: any, sqsClient: SQSClient, queueUrl: string) {
        const orderCreationMessage: OrderCreationMessage = JSON.parse(message);
        await this.pendingOrderService.handleOrderCreation();
        await this.deleteMessage(message, sqsClient, queueUrl);
    }

    private async deleteMessage(message: any, sqsClient: SQSClient, queueUrl: string) {
        await sqsClient.send(new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle
        }));
    }
}
