import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';
import { Marketdata } from './marketdata.entity';
import { Instrument } from 'src/instruments/instrument.entity';

@Controller('marketdata')
export class MarketdataController {
    constructor(
        private marketdataService: MarketdataService
    ) {}

    @Get('/:ticker')
        getByTicker(@Param('ticker') ticker: string): Promise<Marketdata> {
            return this.marketdataService.getByTicker(ticker);
        }
        
    @Post('/query')
    async query(@Body() body: { instrumentIds: number[] }): Promise<Marketdata[]> {
        const marketdata = await this.marketdataService.getManyByInstrumentIdAndMostRecent(body.instrumentIds.map(id => id.toString()));
        return marketdata;
    }
}
