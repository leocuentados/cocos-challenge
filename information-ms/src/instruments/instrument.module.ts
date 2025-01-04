import { Module } from '@nestjs/common';
import { InstrumentService } from './instrument.service';
import { InstrumentController } from './instrument.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrument } from './instrument.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instrument])],
  providers: [InstrumentService],
  controllers: [InstrumentController],
  exports: [InstrumentService],
})
export class InstrumentModule {}
