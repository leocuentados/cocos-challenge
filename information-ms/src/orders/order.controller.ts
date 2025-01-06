import { Body, Controller, Post, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderSide } from './order.enums';
import { Response } from 'express';

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) {}
    @Post('/money')
    async money(@Body() body: { side: OrderSide, size: number, userId: number }, @Res() response: Response): Promise<void> {
        this.orderService.createCashOrder(body.userId, body.side, body.size);
        response.status(201);
        response.send();
    }
}
