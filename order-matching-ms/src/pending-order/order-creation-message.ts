import { OrderSide, OrderType } from "./order.enums";

export interface OrderCreationMessage {
    type: OrderType,
    side: OrderSide,
    size: number,
    instrumentId: number,
    userId: number,
    price: number,
    limit: number
}