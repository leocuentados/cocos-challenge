import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PendingOrder } from './pending-order.entity';
import { PendingOrderEventProducerService } from '../pending-order-event-producer/pending-order-event-producer.service';
import { Repository } from 'typeorm';
import { OrderCreationMessage } from 'src/pending-order-listener/order-creation-message';

@Injectable()
export class PendingOrderService {
    constructor(
        @InjectRepository(PendingOrder) private repository: Repository<PendingOrder>,
        private pendingOrderEventProducerService: PendingOrderEventProducerService
    ) {}

    public async handleOrderCreation(orderCreationMessage: OrderCreationMessage) {
        
    }
}
