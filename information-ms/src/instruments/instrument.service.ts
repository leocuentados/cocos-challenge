import { Injectable } from '@nestjs/common';
import { Instrument } from './instrument.entity';
import { Repository, Like, ILike, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { INSTRUMENT_SEARCH_NAME_LIMIT, INSTRUMENT_SEARCH_TICKER_LIMIT } from 'src/constants';

@Injectable()
export class InstrumentService {
    constructor(
        @InjectRepository(Instrument)
        private instrumentRepository: Repository<Instrument>,
    ) {}

    getByTicker(ticker: string): Promise<Instrument> {
        return this.instrumentRepository.findOneBy({ ticker });
    }

    getManyByTickers(tickers: string[]): Promise<Instrument[]> {
        return this.instrumentRepository.find({
            where: {
                ticker: In(tickers)
            }
        });
    }

    async searchByTickerOrNameLike(searchParam: string): Promise<Instrument[]> {
        const [ byName, byTicker ] = (await Promise.all([this.searchByNameLike(searchParam), this.searchByTickerLike(searchParam)]));
        return byName.concat(byTicker);
    }

    async searchByTickerLike(ticker: string): Promise<Instrument[]> {
        return this.instrumentRepository.find({
            where: {
                ticker: ILike(`${ticker}%`)
            },
            take: INSTRUMENT_SEARCH_TICKER_LIMIT
        });
    }

    async searchByNameLike(name: string): Promise<Instrument[]> {
        return this.instrumentRepository.find({
            where: {
                name: ILike(`${name}%`)
            },
            take: INSTRUMENT_SEARCH_NAME_LIMIT
        });
    }
}
