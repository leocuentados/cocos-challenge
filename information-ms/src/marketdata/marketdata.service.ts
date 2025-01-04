import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Marketdata } from './marketdata.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InstrumentService } from 'src/instruments/instrument.service';

@Injectable()
export class MarketdataService {
    constructor(
        @InjectRepository(Marketdata)
        private marketdataRepository: Repository<Marketdata>,
        private instrumentService: InstrumentService
    ) {}

    get(): Promise<Marketdata[]> {
        return this.marketdataRepository.find();
    }

    async getByTicker(ticker: string): Promise<Marketdata> {
        const instrument = await this.instrumentService.getByTicker(ticker);
        if (instrument === null) {
            throw new HttpException('Instrument not found', 404);
        }
        return this.marketdataRepository.findOneBy({ instrumentId: instrument.id });
    }
}
