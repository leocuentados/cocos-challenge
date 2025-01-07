import { Module } from '@nestjs/common';
import { PendingOrderModule } from './pending-order/pending-order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from './config/constants';
import { PendingOrderEventProducerModule } from './pending-order-event-producer/pending-order-event-producer.module';
import { TrxUnitOfWorkModule } from './trx-unit-of-work/trx-unit-of-work.module';

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
      synchronize: false,
    }),
    PendingOrderEventProducerModule,
    TrxUnitOfWorkModule,
  ],
  providers: []
})
export class AppModule {}
