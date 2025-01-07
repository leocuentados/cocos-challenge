import { Injectable } from '@nestjs/common';
import { TrxUnitOfWorkService } from 'src/trx-unit-of-work/trx-unit-or-work.service';
import { PendingOrder } from './pending-order.entity';
import { OrderSide } from './order.enums';
import { orderSideProperties } from './order.utils';
import { In } from 'typeorm';
import { OrderType } from 'aws-sdk/clients/workdocs';

@Injectable()
export class PendingOrderRepository {
  constructor(private readonly uow: TrxUnitOfWorkService) {} 

    async match(userId: number, size: number, orderSide: OrderSide, orderType: OrderType, instrumentId: number, ignoreMatches: number, limit?: number): Promise<PendingOrder | null> {
        const pricelimitOrder = orderType.toString() === 'LIMIT'
          ? `ORDER BY (price / size) ${orderSideProperties(orderSide).priceOrderPreference}, (pricelimit / size) ${orderSideProperties(orderSide).priceOrderPreference}`
          : `ORDER BY price ${orderSideProperties(orderSide).priceOrderPreference}`;
        
        const pricelimitMinMaxValue = orderType.toString() === 'LIMIT'
          ? `AND (pricelimit / size) ${orderSideProperties(orderSide).whereOp} ${limit}`
          : ``;

        const sql = `
            SELECT *
            FROM pending_orders
            WHERE side = '${orderSide.toString()}'
            AND instrumentid = '${instrumentId}'
            AND userid != ${userId}
            ${pricelimitMinMaxValue}
            ${pricelimitOrder}
            FOR UPDATE SKIP LOCKED
            LIMIT 1
            OFFSET ${ignoreMatches}
        `;

        const result = await this.uow.getManager().query(sql);
        return result.length > 0 ? {
          id: result[0].id,
          instrumentId: result[0].instrumentid,
          size: result[0].size,
          type: result[0].type,
          price: parseFloat(result[0].price.toString()),
          status: result[0].status,
          datetime: result[0].datetime,
          userId: result[0].userid,
          side: result[0].side,
          pricelimit: parseFloat(result[0].pricelimit.toString())
        } : null;
    }

  async deleteMany(pendingOrders: PendingOrder[]) {
    return this.uow.getManager().delete(PendingOrder, { id: In(pendingOrders.map(order => order.id)) })
  }

  async create(order: PendingOrder): Promise<PendingOrder> {
    const { id, ...orderData } = order;
    return this.uow.getManager().save(PendingOrder, orderData);
  }
}