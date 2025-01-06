export interface CreateOrderDto {
    userId: number;
    instrumentId: number;
    size: number;
    side: string;
    type: string;
    price: number;
}
