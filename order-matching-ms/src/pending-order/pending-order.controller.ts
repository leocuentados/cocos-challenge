import { Controller, Get } from "@nestjs/common";
import { PendingOrderService } from "./pending-order.service";

@Controller('healthcheck')
export class PendingOrderController {
    constructor(private pendingOrderService: PendingOrderService) {}
    
    @Get()
    public healthcheck() {
        return this.pendingOrderService.forceInstance();
    }
}