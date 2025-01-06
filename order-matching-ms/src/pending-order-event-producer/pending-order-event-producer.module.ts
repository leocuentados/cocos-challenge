import { Module } from '@nestjs/common';
import { PendingOrderEventProducerService } from './pending-order-event-producer.service';

@Module({
    providers: [PendingOrderEventProducerService],
    exports: [PendingOrderEventProducerService]
})
export class PendingOrderEventProducerModule {}
