import { CreateOrderDto } from "./create-order.dto";
import { OrderValidationClient } from "./order-validation.client";

export class OrderService {
    constructor (private orderValidationClient: OrderValidationClient) {}
    createOrder(createOrderDto: CreateOrderDto): Promise<void> {
        return this.orderValidationClient.create(createOrderDto);
    }

}