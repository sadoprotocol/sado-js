import type { Sado } from "../Sado";

export class OrderbookService {
  constructor(readonly sado: Sado) {}

  /**
   * Retrieve orderbook analytics data for the given address.
   *
   * @param address - Address to retrieve analytics for.
   *
   * @returns Analytics data.
   */
  async analytics(address: string): Promise<any> {
    return this.sado.rpc.call<any>(
      "GetOrderbookAnalytics",
      {
        network: this.sado.network,
        address
      },
      this.sado.rpc.id
    );
  }

  /**
   * Retrieve orderbook for given address.
   *
   * @param address - Address to retrieve orderbook for.
   *
   * @returns Orderbook result
   */
  async get(address: string): Promise<Orderbook> {
    return this.sado.rpc.call<Orderbook>(
      "GetOrderbook",
      {
        network: this.sado.network,
        address
      },
      this.sado.rpc.id
    );
  }

  /**
   * Retrieve a list of orders for given address.
   *
   * @param address - Address to retrieve orders for.
   * @param filter  - Filter to apply to order result.
   *
   * @returns List of orders.
   */
  async orders(address: string, filter: OrderFilter): Promise<any[]> {
    return this.sado.rpc.call<any[]>(
      "GetOrderbookOrders",
      {
        network: this.sado.network,
        address,
        filter
      },
      this.sado.rpc.id
    );
  }

  /**
   * Retrieve a list of offers for given address.
   *
   * @param address - Address to retrieve offers for.
   * @param filter  - Filter to apply to order result.
   *
   * @returns List of offers.
   */
  async offers(address: string, filter: OrderFilter): Promise<any[]> {
    return this.sado.rpc.call<any[]>(
      "GetOrderbookOffers",
      {
        network: this.sado.network,
        address,
        filter
      },
      this.sado.rpc.id
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Service Composer
 |--------------------------------------------------------------------------------
 */

export function makeOrderbookService(sado: Sado, Service = OrderbookService) {
  return new Service(sado);
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type OrderFilter = {
  status?: "pending" | "rejected" | "completed";
  "order.type"?: "sell" | "buy";
};

type Orderbook = {
  orders: any[];
  offers: any[];
};
