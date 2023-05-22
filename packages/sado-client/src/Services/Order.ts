import type { Order } from "../Models/Order";
import type { SadoClient } from "../SadoClient";

export class OrderService {
  constructor(readonly sado: SadoClient) {}

  /**
   * Retrieve an order by its CID _(Content Identifier)_.
   *
   * @param cid - Content identifier of order.
   *
   * @returns Order result.
   */
  async get(cid: string): Promise<Order> {
    return this.sado.rpc.call<Order>("order.get", { cid }, this.sado.rpc.id);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Service Composer
 |--------------------------------------------------------------------------------
 */

export function makeOrderService(sado: SadoClient, Service = OrderService) {
  return new Service(sado);
}
