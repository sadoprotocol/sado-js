import { CreateResponse, Order, OrderRecord } from "../Models/Order";
import type { Sado } from "../Sado";

export class OrderService {
  constructor(readonly sado: Sado) {}

  /**
   * Retrieve an order by its CID _(Content Identifier)_.
   *
   * @param cid - Content identifier of order.
   *
   * @returns Order result.
   */
  async get(cid: string): Promise<Order> {
    const record = await this.sado.rpc.call<OrderRecord>("GetOrder", { cid }, this.sado.rpc.id);
    return Order.for(record);
  }

  /**
   * Generate a signable PSBT for given maker and location. This can be used to
   * create a signature for wallets that does not support message signing.
   *
   * @param location - Location order is being created for. Format: txid:vout
   * @param maker    - Maker address to generate PSBT for.
   * @param pubkey   - Wallet public key to use for signing.
   *
   * @returns PSBT hex.
   */
  async createSignablePsbt(location: string, maker: string, pubkey?: string): Promise<string> {
    return this.sado.rpc.call<string>(
      "CreateSignablePsbt",
      {
        network: this.sado.network,
        location,
        maker,
        pubkey
      },
      this.sado.rpc.id
    );
  }

  /**
   * Verify the order details and create a new IPFS order record and a PSBT can
   * be finalized and relayed to the blockchain to register with decentralized
   * orderbooks.
   *
   * @param order - Order to submit.
   *
   * @returns CID of order.
   */
  async create(order: Order): Promise<CreateResponse> {
    if (order.signature === undefined) {
      throw new Error("You cannot submit an order without a signature.");
    }
    return this.sado.rpc.call<CreateResponse>(
      "CreateOrder",
      {
        network: this.sado.network,
        order: {
          type: order.type,
          ts: order.ts,
          location: order.location,
          cardinals: order.cardinals,
          maker: order.maker,
          expiry: order.expiry,
          satoshi: order.satoshi,
          meta: order.meta,
          orderbooks: order.orderbooks
        },
        signature: {
          value: order.signature.value,
          format: order.signature.format,
          desc: order.signature.desc
        },
        fees: {
          network: order.fees.network,
          rate: order.fees.rate
        }
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

export function makeOrderService(sado: Sado, Service = OrderService) {
  return new Service(sado);
}
