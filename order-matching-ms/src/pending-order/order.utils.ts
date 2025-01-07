import { OrderSide } from "./order.enums";

export const getOppositeOrderSide = (orderSide: OrderSide) => {
    switch(orderSide.toString()) {
        case 'BUY': return OrderSide.SELL;
        case 'SELL': return OrderSide.BUY;
    }
}

export const orderSideProperties = (orderSide: OrderSide): {
    priceOrderPreference: 'ASC' | 'DESC', whereOp: '<=' | '>='
} => {
    switch(orderSide.toString()) {
        case 'BUY': return {
            priceOrderPreference: 'DESC',
            whereOp: '>='
        };
        case 'SELL': return {
            priceOrderPreference: 'ASC',
            whereOp: '<='
        }
    }
}

export const getOrderProportionalPrice = (totalPrice, totalSize, takenSize) => {
    const pricePerSize = totalPrice / totalSize; 
    return pricePerSize * takenSize; 
}