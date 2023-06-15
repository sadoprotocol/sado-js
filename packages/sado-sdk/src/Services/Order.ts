import { Order, OrderPayload, OrderRecord, OrderSignature, SubmitResponse } from "../Models/Order";
import { Signature } from "../Models/Signature";
import type { SadoClient } from "../SadoClient";

export class OrderService {
  constructor(readonly sado: SadoClient) {}

  /**
   * Create a new order instance which can be validated, signed and submitted.
   *
   * @param payload - Order payload.
   *
   * @returns Order instance.
   */
  create(payload: OrderPayload): Order {
    return new Order(this.sado, payload);
  }

  /**
   * Load a new order instance from a payload and signature. This is useful for
   * generating an order instance from a payload and signature that has been
   * constructed outside of the SDK.
   *
   * @param payload - Order payload.
   *
   * @returns Order instance.
   */
  load(payload: OrderPayload & OrderSignature): Order {
    const order = new Order(this.sado, payload);
    order.signature = new Signature(payload.signature, {
      format: payload.signature_format,
      desc: payload.desc
    });
    return order;
  }

  /**
   * Retrieve an order by its CID _(Content Identifier)_.
   *
   * @param cid - Content identifier of order.
   *
   * @returns Order result.
   */
  async get(cid: string): Promise<Order> {
    const record = await this.sado.rpc.call<OrderRecord>("order.getOrder", { cid }, this.sado.rpc.id);
    return Order.for(this.sado, record);
  }

  /**
   * Generate a signable PSBT for given maker and location. This can be used to
   * create a signature for wallets that does not support message signing.
   *
   * @param location - Location order is being created for. Format: txid:vout
   * @param maker    - Maker address to generate PSBT for.
   *
   * @returns PSBT hex.
   */
  async psbt(location: string, maker: string): Promise<string> {
    return this.sado.rpc.call<string>(
      "order.getPsbtSignature",
      { location, maker, network: this.sado.network },
      this.sado.rpc.id
    );
  }

  /**
   * Submit a partial order to the API to generate a CID _(Content Identifier)_.
   *
   * @param order      - Order to submit.
   * @param networkFee - Network fee incentive to apply to the transaction.
   * @param feeRate    - Fee rate to apply to the transaction.
   *
   * @returns CID of order.
   */
  async submit(order: Order, networkFee = 1000, feeRate = 15): Promise<SubmitResponse> {
    if (order.signature === undefined) {
      throw new Error("You cannot submit an order without a signature");
    }
    const payload = {
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
        network: networkFee,
        rate: feeRate
      }
    };
    return this.sado.rpc.call<SubmitResponse>("order.createOrder", payload, this.sado.rpc.id);
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