import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Producer } from 'sqs-producer';
import { environment, MONEY_INSTRUMENT_ID } from 'src/constants';
import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderSide, OrderStatus } from './order.enums';
import { Consumer } from 'sqs-consumer';
import { CompletedOrderMessage } from './completed-order-message';

@Injectable()
export class OrderService {
    private sqsProducer: Producer;
    private sqsConsumer: SQSClient

    constructor(
      @InjectRepository(Order) private readonly orderRepository: Repository<Order>
    ) {
      this.sqsProducer = Producer.create({
        queueUrl: environment.sqs.portfolio_ms_url,
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
      this.sqsConsumer = new SQSClient({
        region: environment.aws.region,
        endpoint: environment.sqs.url,
        credentials: {
            accessKeyId: environment.aws.access_key_id,
            secretAccessKey: environment.aws.secret_access_key,
          },
      });
      this.initListener();
    }

    private async initListener() {
      const listener = Consumer.create({
          queueUrl: environment.sqs.information_ms_url,
          handleMessage: async (message) => this.handleListenerMessage(message, this.sqsConsumer, environment.sqs.information_ms_url),
          sqs: this.sqsConsumer,
      });

      listener.on('error', (err) => {
          console.error('Unexpected order-matching-ms queue listener error:', err);
      });

      listener.start();
      console.info(`Listening from ${environment.sqs.information_ms_url}`);
    }

    private async handleListenerMessage(message: any, sqsClient: SQSClient, queueUrl: string) {
      console.info(`[PendingOrderService] received message: ${message.Body}`)
      const parsedMessage: { orders: CompletedOrderMessage[] } = JSON.parse(message.Body);
      await this.handleCompletedOrderMessage(parsedMessage.orders);
      await this.deleteMessage(message, sqsClient, queueUrl);
    }

    private async deleteMessage(message: any, sqsClient: SQSClient, queueUrl: string) {
      await sqsClient.send(new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle
      }));
    }

    public sendMessage(messageBody: string): Promise<any> {
      return this.sqsProducer.send({ id: uuidv4(), body: messageBody });
    }

    private async handleCompletedOrderMessage(completedOrders: CompletedOrderMessage[]) {
      const orders: Order[] = completedOrders.map(completed => {
        return {
          id: undefined,
          instrumentId: parseInt(completed.instrumentId.toString()),
          size: completed.size,
          side: completed.side,
          type: completed.type,
          status: completed.status,
          datetime: new Date(),
          price: completed.price,
          userId: parseInt(completed.userId.toString())
        }
      })

      for (const order of orders) {
        if (order.status === 'FILLED') {
          switch(order.side) {
            case 'BUY': {
              const cashOut = {
                ...order
              };
              cashOut.side = 'CASH_OUT';
              cashOut.instrumentId = MONEY_INSTRUMENT_ID;
              orders.push(cashOut);
            }; break;
            case 'SELL': {
              const cashIn = {
                ...order
              };
              cashIn.side = 'CASH_IN';
              cashIn.instrumentId = MONEY_INSTRUMENT_ID;
              orders.push(cashIn)
            } break;
            default: break;
          }
        }
      }

      const createdOrders: Order[] = await this.orderRepository.save(orders);
      await this.sendPortfolioQueueMessage(createdOrders);
    }

    public async sendPortfolioQueueMessage(orders: Order[]) {
          const cashInOrder: Order[] = orders
              .filter(order => order.side === 'CASH_IN')

              if (cashInOrder.length > 0) {
                cashInOrder
                  .reduce((accumulator, currentOrder) => {
                    accumulator.size += currentOrder.size;
                    return accumulator;
                  });
              }

              const cashOutOrder: Order[] = orders
                .filter(order => order.side === 'CASH_OUT')

              if (cashOutOrder.length > 0) {
                cashOutOrder
                .reduce((accumulator, currentOrder) => {
                    accumulator.size += currentOrder.size;
                    return accumulator;
                  });
              }


          const buyOrders: Order[] = orders.filter(order => order.side === 'BUY' && order.status === 'FILLED');
          const sellOrders: Order[] = orders.filter(order => order.side === 'SELL' && order.status === 'FILLED');
  
          const messageOrders = 
              cashInOrder
                .concat(cashOutOrder)
                .concat(buyOrders)
                .concat(sellOrders);
  
          if (messageOrders.length > 0) {
              await this.sendMessage(JSON.stringify({
                  orders: messageOrders
              }));
              console.info(`[OrderService] portfolio queue message sent for user ${orders[0].userId}`)
          }
    }

    public findAllByUserId(userId: number): Promise<Order[]> {
      return this.orderRepository.find({ where: { userId: userId } })
    }

    public async createCashOrder(userId: number, side: OrderSide, size: number): Promise<Order> {
      if (OrderSide.CASH_OUT === side) {
        const cashOutOrders = await this.orderRepository.find({ where: { userId: userId, side: OrderSide.CASH_IN.toString() } })
        const previousCash = cashOutOrders.reduce((accumulator, currentOrder) => {
          return accumulator + currentOrder.size;
        }, 0);

        if (previousCash < size) {
          throw new HttpException('La cantidad solicitada es menor al monto disponible', HttpStatus.BAD_REQUEST)
        }
      }

      const order = this.orderRepository.create({
        userId: userId,
        instrumentId: MONEY_INSTRUMENT_ID,
        side: side.toString(),
        price: 1,
        size: size,
        status: 'FILLED',
        datetime: new Date(),
        type: 'MARKET'
      });

      await this.sendPortfolioQueueMessage([order]);

      return order;
    }
}
