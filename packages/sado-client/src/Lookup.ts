import type { Offer } from "./Models/Offer";
import type { Order } from "./Models/Order";
import type { SadoClient } from "./SadoClient";

export class Lookup {
  constructor(readonly sado: SadoClient) {}

  /**
   * Retrieve orderbook for given address.
   *
   * @param address - Address to retrieve orderbook for.
   *
   * @returns Orderbook result
   */
  async orderbook(address: string): Promise<Orderbook> {
    return this.sado.rpc.call<Orderbook>(
      "GetOrderbook",
      {
        address
      },
      this.sado.rpc.id
    );
  }

  /**
   * Retrieve an order by its CID _(Content Identifier)_.
   *
   * @param cid - Content identifier of order.
   *
   * @returns Order result.
   */
  async order(cid: string): Promise<Order> {
    return this.sado.rpc.call<Order>("GetOrder", { cid }, this.sado.rpc.id);
  }

  /**
   * Retrieve an offer by its CID _(Content Identifier)_.
   *
   * @param cid - Content identifier of offer.
   *
   * @returns Offer result.
   */
  async offer(cid: string): Promise<Offer> {
    return this.sado.rpc.call<Offer>("GetOffer", { cid }, this.sado.rpc.id);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Orderbook = {
  orders: any[];
  offers: any[];
};
