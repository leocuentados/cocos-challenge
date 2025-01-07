export interface CreateOrderDto {
    userId: string;
    instrumentId: number;
    size: number;
    side: string;
    type: string;
    limit?: number;
}
