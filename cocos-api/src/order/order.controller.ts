import { CreateOrderDto } from "./create-order.dto";
import { OrderService } from "./order.service";

export class OrderController {
    constructor(private orderService: OrderService) {}
    
    async createOrder(createOrderDto: CreateOrderDto) {
        const response = await this.orderService.createOrder(createOrderDto);
        return { message: `Order created for user ${createOrderDto.userId}`, order: response };
    }
}

