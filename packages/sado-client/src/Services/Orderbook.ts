import type { SadoClient } from "../SadoClient";

export class OrderbookService {
  constructor(readonly sado: SadoClient) {}

  /**
   * Retrieve orderbook for given address.
   *
   * @param address - Address to retrieve orderbook for.
   *
   * @returns Orderbook result
   */
  async get(address: string): Promise<Orderbook> {
    return this.sado.rpc.call<Orderbook>(
      "orderbook.get",
      {
        address,
        network: this.sado.network
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
      "orderbook.orders",
      {
        address,
        filter,
        network: this.sado.network
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
      "orderbook.offers",
      {
        address,
        filter,
        network: this.sado.network
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

export function makeOrderbookService(sado: SadoClient, Service = OrderbookService) {
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
