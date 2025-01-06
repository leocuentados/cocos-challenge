import { Order } from "src/orders/order.entity";
import { OrderService } from "src/orders/order.service"

export const generatePortfolioMessagesFromOrders = async (orderService: OrderService) => {
    const userIds = [1]
    for (const user of userIds) {
        const orders = await orderService.findAllByUserId(user)
        await orderService.sendPortfolioQueueMessage(orders)
    }
    console.log('First portfolio-ms-queue messages sent')
}