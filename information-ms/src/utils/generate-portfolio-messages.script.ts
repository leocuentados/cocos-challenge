import { Order } from "src/orders/order.entity";
import { OrderService } from "src/orders/order.service"

export const generatePortfolioMessagesFromOrders = async (orderService: OrderService) => {
    const userIds = [1]
    for (const user of userIds) {
        const orders = await orderService.findAllByUserId(user);
        const cashInOrder: Order = orders
            .filter(order => order.side === 'CASH_IN')
            .reduce((accumulator, currentOrder) => {
            accumulator.size += currentOrder.size;
            return accumulator;
            });
        const cashOutOrder: Order = orders
            .filter(order => order.side === 'CASH_OUT')
            .reduce((accumulator, currentOrder) => {
            accumulator.size += currentOrder.size;
            return accumulator;
            });
        const buyOrders: Order[] = orders.filter(order => order.side === 'BUY' && order.status === 'FILLED');
        const sellOrders: Order[] = orders.filter(order => order.side === 'SELL' && order.status === 'FILLED');

        const messageOrders = 
            (cashInOrder ? [cashInOrder] : [])
            .concat(cashOutOrder ? [cashOutOrder] : [])
            .concat(buyOrders)
            .concat(sellOrders);

        if (messageOrders.length > 0) {
            await orderService.sendMessage(JSON.stringify({
                orders: messageOrders
            }));
            console.log('First PortfolioMsQueue message sent')
        }
    }
}