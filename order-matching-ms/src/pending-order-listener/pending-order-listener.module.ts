import { Module } from '@nestjs/common';
import { PendingOrderListenerService } from './pending-order-listener.service';
import { PendingOrderModule } from 'src/pending-order/pending-order.module';

@Module({
    providers: [PendingOrderListenerService],
    exports: [PendingOrderListenerService],
    imports: [PendingOrderModule]
})
export class PendingOrderListenerModule {}
