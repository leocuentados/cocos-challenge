import { SQSClient } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { Producer } from 'sqs-producer';
import { environment } from 'src/config/constants';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PendingOrderEventProducerService {
    private informationMsQueue: Producer;
    constructor() {
        this.informationMsQueue = Producer.create({
            queueUrl: environment.sqs.information_ms_url,
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

        console.info(`[PendingOrderEventProducerService] ready to send messages to ${environment.sqs.information_ms_url}`)
    }

    public async sendMessage(messageBody: string) {
        const res = await this.informationMsQueue.send({ id: uuidv4(), body: messageBody });
        console.info(`[PendingOrderEventProducerService] message sent: ${messageBody}`)
        return res;
      }
}
