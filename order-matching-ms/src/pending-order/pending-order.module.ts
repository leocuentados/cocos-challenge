import { Module } from '@nestjs/common';
import { PendingOrderService } from './pending-order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingOrder } from './pending-order.entity';
import { PendingOrderEventProducerModule } from 'src/pending-order-event-producer/pending-order-event-producer.module';
import { TrxUnitOfWorkModule } from 'src/trx-unit-of-work/trx-unit-of-work.module';
import { PendingOrderRepository } from './pending-order.repository';
import { PendingOrderController } from './pending-order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PendingOrder]), PendingOrderEventProducerModule, TrxUnitOfWorkModule],
  providers: [PendingOrderService, PendingOrderRepository],
  exports: [PendingOrderService],
  controllers: [PendingOrderController]
})
export class PendingOrderModule {}
