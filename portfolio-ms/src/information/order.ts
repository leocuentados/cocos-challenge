export interface Order {
    id: number;
    instrumentId: number;
    userId: number;
    size: number;
    price: number;
    type: string;
    side: string;
    status: string;
    datetime: Date;
}
