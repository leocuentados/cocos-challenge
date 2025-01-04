import axios from "axios";
import { CustomError } from "../config/exception-handler";
import { CreateOrderDto } from "./create-order.dto";

export class OrderValidationClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        if (baseUrl === '') {
            throw new CustomError(500, new Error('Order Validation URL is required'));
        }
        this.baseUrl = baseUrl;
    }

    async create(order: CreateOrderDto): Promise<void> {
        return (await axios.post(`${this.baseUrl}/`, order));
    }
}