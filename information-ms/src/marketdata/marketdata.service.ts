import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Marketdata } from './marketdata.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InstrumentService } from 'src/instruments/instrument.service';
import { EntityManager, In } from 'typeorm';

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

    getManyByInstrumentIdAndMostRecent(instrumentIds: string[]): Promise<Marketdata[]> {
        const entityManager: EntityManager = this.marketdataRepository.manager;

        const query = `
          SELECT m.*
          FROM marketdata m
          INNER JOIN (
            SELECT "instrumentid", MAX(date) as maxDate
            FROM marketdata
            WHERE "instrumentid" = ANY($1)
            GROUP BY "instrumentid"
          ) latest ON m."instrumentid" = latest."instrumentid" AND m.date = latest.maxDate
        `;
      
        return entityManager.query(query, [instrumentIds]);
    }

    async getByTicker(ticker: string): Promise<Marketdata> {
        const instrument = await this.instrumentService.getByTicker(ticker);
        if (instrument === null) {
            throw new HttpException('Instrument not found', 404);
        }
        return this.marketdataRepository.findOneBy({ instrumentId: instrument.id });
    }
}
