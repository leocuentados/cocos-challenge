import { Module } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';
import { MarketdataController } from './marketdata.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marketdata } from './marketdata.entity';
import { InstrumentModule } from 'src/instruments/instrument.module';

@Module({
  imports: [TypeOrmModule.forFeature([Marketdata]), InstrumentModule],
  providers: [MarketdataService],
  controllers: [MarketdataController]
})
export class MarketdataModule {}
