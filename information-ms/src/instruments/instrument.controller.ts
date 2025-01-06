import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { Instrument } from './instrument.entity';
import { InstrumentService } from './instrument.service';

@Controller('instruments')
export class InstrumentController {
    constructor(private instrumentService: InstrumentService) {}

    @Get('/search')
    search(@Query('searchParam') searchParam: string): Promise<Instrument[]> {
        return this.instrumentService.searchByTickerOrNameLike(searchParam);
    }
}
