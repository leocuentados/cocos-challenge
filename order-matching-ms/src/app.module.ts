import { Module } from '@nestjs/common';
import { PendingOrderModule } from './pending-order/pending-order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from './config/constants';
import { PendingOrderEventProducerService } from './pending-order-event-producer/pending-order-event-producer.service';
import { PendingOrderListenerModule } from './pending-order-listener/pending-order-listener.module';
import { PendingOrderEventProducerModule } from './pending-order-event-producer/pending-order-event-producer.module';

@Module({
  imports: [
    PendingOrderModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environment.db.host,
      port: environment.db.port,
      username: environment.db.username,
      password: environment.db.password,
      database: environment.db.database,
      autoLoadEntities: true,
      synchronize: environment.node_env === 'DEV',
    }),
    PendingOrderListenerModule,
    PendingOrderEventProducerModule,
  ],
})
export class AppModule {}
