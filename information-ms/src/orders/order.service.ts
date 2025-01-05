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

    public findAllByUserId(userId: number): Promise<Order[]> {
      return this.orderRepository.find({ where: { userId: userId } })
    }

    public async createCashOrder(userId: number, side: OrderSide, price: number): Promise<Order> {
      if (OrderSide.CASH_OUT === side) {
        const cashOutOrders = await this.orderRepository.find({ where: { userId: userId, side: OrderSide.CASH_IN.toString() } })
        const previousCash = cashOutOrders.reduce((accumulator, currentOrder) => {
          return accumulator + currentOrder.size;
        }, 0);

        if (previousCash < price) {
          throw new HttpException('La cantidad solicitada es menor al monto disponible', HttpStatus.BAD_REQUEST)
        }
      }

      return this.orderRepository.create({
        userId: userId,
        instrumentId: 1,
        side: side.toString(),
        price: price,
        size: 1,
        status: OrderStatus.FILLED.toString(),
        datetime: new Date()
      })
    }
}
