export enum OrderSide {
    BUY = 'BUY', 
    SELL = 'SELL', 
    CASH_IN = 'CASH_IN', 
    CASH_OUT = 'CASH_OUT'
}

export enum OrderStatus {
    NEW = 'NEW', 
    REJECTED = 'REJECTED', 
    FILLED = 'FILLED', 
    CANCELLED = 'CANCELLED'
}

export enum OrderType {
    MARKET = 'MARKET', 
    LIMIT = 'LIMIT'
}