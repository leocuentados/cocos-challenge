export interface CompletedOrderMessage {
    status: 'FILLED' | 'REJECTED' | 'CANCELLED',
    side: 'BUY' | 'SELL',
    size: number,
    instrumentId: number,
    price: number,
    userId: number,
    type: 'MARKET' | 'LIMIT',
}