import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { PendingOrder } from './pending-order.entity';
import { PendingOrderEventProducerService } from '../pending-order-event-producer/pending-order-event-producer.service';
import { OrderSide, OrderStatus, OrderType } from './order.enums';
import { getOppositeOrderSide, getOrderProportionalPrice } from './order.utils';
import { environment } from 'src/config/constants';
import { PendingOrderRepository } from './pending-order.repository';
import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';
import { TrxUnitOfWorkService } from 'src/trx-unit-of-work/trx-unit-or-work.service';
import { OrderCreationMessage } from './order-creation-message';

@Injectable()
export class PendingOrderService {
    private orderMatchingMsQueue: SQSClient;

    constructor(
        private repository: PendingOrderRepository,
        private pendingOrderEventProducerService: PendingOrderEventProducerService,
        private unitOfWork: TrxUnitOfWorkService
    ) {
        this.orderMatchingMsQueue = new SQSClient({
            region: environment.aws.region,
            endpoint: environment.sqs.url,
            credentials: {
                accessKeyId: environment.aws.access_key_id,
                secretAccessKey: environment.aws.secret_access_key,
            },
        });
        this.initListener();
    }

    public forceInstance() {
        return true;
    };

    private async initListener() {
        const listener = Consumer.create({
            queueUrl: environment.sqs.order_matching_ms_url,
            handleMessage: async (message) => this.handleListenerMessage(message, this.orderMatchingMsQueue, environment.sqs.order_matching_ms_url),
            sqs: this.orderMatchingMsQueue,
        });

        listener.on('error', (err) => {
            console.error('Unexpected order-matching-ms queue listener error:', err);
        });

        listener.start();
        console.info(`Listening from ${environment.sqs.order_matching_ms_url}`);
    }

    private async handleListenerMessage(message: any, sqsClient: SQSClient, queueUrl: string) {
        console.info(`[PendingOrderService] received message: ${message.Body}`)
        const orderCreationMessage: OrderCreationMessage = JSON.parse(message.Body).order;
        this.unitOfWork.doTransactional(async () => {
            await this.handleOrderCreation(orderCreationMessage);
            await this.deleteMessage(message, sqsClient, queueUrl);
        }); 
    }

    private async deleteMessage(message: any, sqsClient: SQSClient, queueUrl: string) {
        await sqsClient.send(new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle
        }));
    }

    public async handleOrderCreation(orderCreationMessage: OrderCreationMessage) {
        if (orderCreationMessage.type.toString() === OrderType.MARKET.toString()) {
            await this.handleMarketOrderCreation(orderCreationMessage);
        } else {
            await this.handleLimitOrderCreation(orderCreationMessage);
        }
    }

    private async handleLimitOrderCreation(orderCreationMessage: OrderCreationMessage) {
        const incomingOrder = {
            userId: orderCreationMessage.userId,
            instrumentId: orderCreationMessage.instrumentId,
            id: 0,
            size: orderCreationMessage.size,
            side: orderCreationMessage.side,
            type: orderCreationMessage.type,
            price: orderCreationMessage.price,
            status: 'NEW',
            datetime: new Date(),
            pricelimit: orderCreationMessage.limit
        };

        const pendingOrder = await this.repository.match(
            orderCreationMessage.userId,
            orderCreationMessage.size,
            getOppositeOrderSide(orderCreationMessage.side), 
            OrderType.LIMIT,
            orderCreationMessage.instrumentId, 
            0, 
            orderCreationMessage.limit
        );

        // caso 1: entra una orden y no hace match con ninguna
        // se crea el entrante en la tabla
        if (!pendingOrder) {
            return await this.repository.create(incomingOrder);
        }

        let filledOrders = [];

        // caso 2: entra una orden y hace match perfecto con otra
        // ambas ordenes filled se envian como evento
        if (pendingOrder.size === incomingOrder.size) {
            pendingOrder.status = 'FILLED';
            incomingOrder.status = 'FILLED';
            filledOrders.push(pendingOrder);
            incomingOrder.price = pendingOrder.price;
            filledOrders.push(incomingOrder);
        } else {
        // caso 3: entra una orden y matchea con otra, una de las dos es ejecutada y la otra queda con size sobrante
        // la orden con size sobrante se recalculan sus valores proporcionalmente y persiste como una nueva pending order
        // se envian dos ordenes filled como evento
            let incompleteOrder;
            let partialFilledOrder;
            let filledOrder;

            if (pendingOrder.size > incomingOrder.size) {
                incompleteOrder = Object.assign({}, pendingOrder);
                filledOrder = incomingOrder;
            } else {
                incompleteOrder = Object.assign({}, incomingOrder);
                filledOrder = pendingOrder;
            }

            filledOrder.status = 'FILLED';

            partialFilledOrder = Object.assign({}, incompleteOrder);
            partialFilledOrder.price = filledOrder.price;
            // partialFilledOrder.price = getOrderProportionalPrice(incompleteOrder.price, incompleteOrder.size, filledOrder.size-(incompleteOrder.size-filledOrder.size));
            partialFilledOrder.status = 'FILLED';
            partialFilledOrder.datetime = new Date();
            partialFilledOrder.size = filledOrder.size; 

            incompleteOrder.price = getOrderProportionalPrice(incompleteOrder.price, incompleteOrder.size, incompleteOrder.size-filledOrder.size);
            incompleteOrder.pricelimit = getOrderProportionalPrice(incompleteOrder.pricelimit, incompleteOrder.size, incompleteOrder.size-filledOrder.size);
            incompleteOrder.status = 'NEW';
            incompleteOrder.datetime = new Date();
            incompleteOrder.id = undefined;
            incompleteOrder.size -= filledOrder.size;
            await this.repository.create(incompleteOrder);

            filledOrders.push(filledOrder);
            filledOrders.push(partialFilledOrder);
        }

        // en todos los casos se borra el que vino de la tabla
        await this.repository.deleteMany([pendingOrder]);

        return this.sendFilledOrdersMessage(filledOrders)
    }

    private async handleMarketOrderCreation(orderCreationMessage: OrderCreationMessage) {
        let requiredOrderSize = orderCreationMessage.size;
        let maxMoneyAllowed = orderCreationMessage.limit; // dinero total disponible del usuario, rechaza la orden si se queda sin dinero
        const matchedOrders: PendingOrder[] = [];
        let matchSuccess = true;

        while (requiredOrderSize > 0) {
            const pendingOrder = await this.repository.match(
                orderCreationMessage.userId,
                orderCreationMessage.size,
                getOppositeOrderSide(orderCreationMessage.side), 
                OrderType.MARKET, 
                orderCreationMessage.instrumentId, 
                matchedOrders.length
            );

            if (orderCreationMessage.side === 'BUY') {
                maxMoneyAllowed -= pendingOrder ? pendingOrder.price : 0;
            }

            if (!pendingOrder || maxMoneyAllowed < 0) {
                matchSuccess = false;
                break;
            }

            requiredOrderSize -= pendingOrder.size;
            pendingOrder.status = 'FILLED';
            matchedOrders.push(pendingOrder);
        }

        if (!matchSuccess) {
            return this.sendRejectedOrderMessage(orderCreationMessage);
        }

        // si la orden se completo parcialmente con una orden, se crea una nueva orden
        // con valores proporcionales a lo que falto para ejecutarse y se borra la
        // orden original
        if (requiredOrderSize < 0) {
            const lastMatchedOrder = matchedOrders[matchedOrders.length - 1];
            const lastMatchedOrderCopy = Object.assign({}, matchedOrders[matchedOrders.length - 1]);
            lastMatchedOrderCopy.status = OrderStatus.NEW.toString();
            lastMatchedOrderCopy.id = undefined;

            lastMatchedOrder.price = getOrderProportionalPrice(lastMatchedOrder.price, lastMatchedOrder.size, lastMatchedOrder.size+requiredOrderSize);
            lastMatchedOrder.size += requiredOrderSize;
            lastMatchedOrderCopy.price = getOrderProportionalPrice(lastMatchedOrderCopy.price, lastMatchedOrderCopy.size, -requiredOrderSize);
            lastMatchedOrderCopy.size = -requiredOrderSize;
            lastMatchedOrder.datetime = new Date();
            await this.repository.create(lastMatchedOrderCopy);
        }

        await this.repository.deleteMany(matchedOrders);
        return this.sendFilledOrdersMessage(matchedOrders, orderCreationMessage);
    }

    private sendFilledOrdersMessage(matchedOrders: PendingOrder[], orderCreationMessage?: OrderCreationMessage) {
        const orders = matchedOrders.map(order => {
            return {
                status: 'FILLED',
                side: order.side,
                size: order.size,
                instrumentId: order.instrumentId,
                price: order.price,
                userId: order.userId,
                type: order.type,
            }
        });

        if (orderCreationMessage) {
            orders.push({
                status: 'FILLED',
                side: orderCreationMessage.side,
                size: orderCreationMessage.size,
                price: orderCreationMessage.price,
                instrumentId: orderCreationMessage.instrumentId,
                userId: orderCreationMessage.userId,
                type: orderCreationMessage.type
            });
        }

        return this.pendingOrderEventProducerService.sendMessage(
            JSON.stringify({
                orders: orders
            })
        )
    }

    public sendRejectedOrderMessage(orderCreationMessage: OrderCreationMessage) {
        return this.pendingOrderEventProducerService.sendMessage(
            JSON.stringify({
                orders: [
                    {
                        ...orderCreationMessage,
                        status: 'REJECTED'
                    },
                ],
            })
        );
    }
}

