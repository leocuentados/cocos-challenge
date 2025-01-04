import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Instrument } from './instrument.entity';
import { InstrumentService } from './instrument.service';

@Controller('instruments')
export class InstrumentController {
    constructor(private instrumentService: InstrumentService) {}

    @Get('/search')
    search(@Req() request: Request): Promise<Instrument[]> {
        return this.instrumentService.searchByTickerOrNameLike(request.query.searchParam.toString());
    }
}
