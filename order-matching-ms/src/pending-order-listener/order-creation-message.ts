import { OrderSide, OrderType } from "src/pending-order/order.enums";

export interface OrderCreationMessage {
    userId: number,
    instrumentId: number,
    size: number,
    side: OrderSide,
    type: OrderType,
    price: number
}