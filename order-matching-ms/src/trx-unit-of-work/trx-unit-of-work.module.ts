import { Module } from '@nestjs/common';
import { TrxUnitOfWorkService } from './trx-unit-or-work.service';

@Module({
    providers: [TrxUnitOfWorkService],
    exports: [TrxUnitOfWorkService]
})
export class TrxUnitOfWorkModule {}
