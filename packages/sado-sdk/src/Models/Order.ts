import { Signature, type SignatureSettings } from "./Signature";

export class Order {
  cid?: string;

  readonly type: OrderType;
  readonly ts: number;
  readonly location: string;
  readonly cardinals: number;
  readonly maker: string;
  readonly orderbooks: string[] = [];

  expiry?: number;
  satoshi?: number;
  meta?: Record<string, any>;

  signature?: Signature;
  satsPerByte?: number;

  constructor(order: OrderPayload) {
    this.type = order.type;
    this.ts = Date.now();
    this.location = order.location;
    this.cardinals = order.cardinals;
    this.maker = order.maker;
  }

  static for(record: OrderRecord): Order {
    const order = new Order(record);
    order.cid = record.cid;
    order.addSignature(record.signature, {
      format: record.signature_format,
      desc: record.desc
    });
    return order;
  }

  /**
   * Get a message used to sign the order for future verification.
   *
   * The signed message is used to verify the maker authenticity by simply validating
   * the signature against the maker address.
   *
   * @returns Message to sign.
   */
  createSignableMessage(): string {
    return Buffer.from(
      JSON.stringify({
        type: this.type,
        ts: this.ts,
        location: this.location,
        cardinals: this.cardinals,
        maker: this.maker,
        expiry: this.expiry,
        satoshi: this.satoshi,
        meta: this.meta,
        orderbooks: this.orderbooks
      })
    ).toString("hex");
  }

  /**
   * Add additional addresse for the order to be listed on.
   *
   * @param address - Address to add to the order.
   * @param fee     - Optional incentive fee for the orderbook.
   *
   * @returns Order instance.
   */
  addOrderbook(address: string, fee = 600): this {
    this.orderbooks.push(`${address}:${fee}`);
    return this;
  }

  /**
   * Remove order listing if it has not been completed within the given block height.
   *
   * @param blockHeight - Block height to expire order at.
   *
   * @returns Order instance.
   */
  addExpiry(blockHeight: number): this {
    this.expiry = blockHeight;
    return this;
  }

  /**
   * Add meta data to your order which consumers can use to guide the presentation of
   * the order to the client.
   *
   * @param meta - Meta data to attach to the order.
   *
   * @returns Order instance.
   */
  addMeta<T extends Record<string, any>>(meta: T): this {
    this.meta = meta;
    return this;
  }

  /**
   * Submit order signature used to verify the order in the future. The signature
   * is generated using the private key of the maker.
   *
   * Format is either a signed message or a PSBT. If signed with BECH32 then desc
   * is required.
   *
   * @param value    - Signature.
   * @param settings - Settings object describing the signing format.
   */
  addSignature(value: string, setting: SignatureSettings): this {
    this.signature = new Signature(value, setting);
    return this;
  }

  /**
   * Add custom incentive fees for the order to be picked up by the mempool.
   *
   * @param value - Satoshis per byte.
   *
   * @returns Order instance.
   */
  setSatsPerByte(value: number): this {
    this.satsPerByte = value;
    return this;
  }

  /**
   * Convert the order instance to a JSON object.
   *
   * @returns Order as JSON.
   */
  toJSON() {
    return {
      cid: this.cid,
      type: this.type,
      ts: this.ts,
      location: this.location,
      cardinals: this.cardinals,
      maker: this.maker,
      expiry: this.expiry,
      satoshi: this.satoshi,
      meta: this.meta,
      orderbooks: this.orderbooks,
      signature: this.signature?.value,
      signature_format: this.signature?.format,
      desc: this.signature?.desc
    };
  }
}

export type OrderRecord = {
  cid: string;
} & OrderPayload &
  OrderSignature;

export type OrderType = "sell" | "buy";

export type OrderPayload = {
  type: OrderType;
  ts: number;
  location: string;
  cardinals: number;
  maker: string;
  expiry?: number;
  satoshi?: number;
  meta?: Record<string, any>;
  orderbooks?: string[];
};

export type OrderSignature = {
  signature: string;
  signature_format?: string;
  pubkey?: string;
  desc?: string;
};

export type CreateResponse = {
  cid: string;
  psbt: string;
};
