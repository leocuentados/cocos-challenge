import { Module } from '@nestjs/common';
import { MarketdataModule } from './marketdata/marketdata.module';
import { UserModule } from './users/user.module';
import { InstrumentModule } from './instruments/instrument.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from './constants';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [
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
    MarketdataModule, 
    UserModule, 
    InstrumentModule, 
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
