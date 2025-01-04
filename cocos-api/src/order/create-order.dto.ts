export interface CreateOrderDto {
    userId: string;
    instrumentId: string;
    size: number;
    side: string;
    type: string;
    price: number;
}
