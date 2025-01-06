import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Producer } from 'sqs-producer';
import { environment } from 'src/constants';
import { SQSClient } from '@aws-sdk/client-sqs';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderSide, OrderStatus } from './order.enums';

@Injectable()
export class OrderService {
    private sqsProducer: Producer;

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
    }

    public sendMessage(messageBody: string): Promise<any> {
      return this.sqsProducer.send({ id: uuidv4(), body: messageBody });
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
        instrumentId: 1,
        side: side.toString(),
        price: 1,
        size: size,
        status: OrderStatus.FILLED.toString(),
        datetime: new Date()
      });

      await this.sendPortfolioQueueMessage([order]);

      return order;
    }
}
