import { Controller, Get, Param } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';
import { Marketdata } from './marketdata.entity';

@Controller('marketdata')
export class MarketdataController {
    constructor(
        private marketdataService: MarketdataService
    ) {}

    @Get('/:ticker')
        getByTicker(@Param('ticker') ticker: string): Promise<Marketdata> {
            return this.marketdataService.getByTicker(ticker);
        }
}
