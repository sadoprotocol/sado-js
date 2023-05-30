import { SadoClient } from "..";
import { Signature, SignatureSettings } from "./Signature";

export class Order {
  cid?: string;

  readonly type: OrderType;
  readonly ts: number;
  readonly location: string;
  readonly cardinals: number;
  readonly maker: string;

  readonly expiry?: number;
  readonly satoshi?: number;
  readonly meta?: Record<string, any>;

  signature?: Signature;

  constructor(readonly sado: SadoClient, order: OrderPayload) {
    this.type = order.type;
    this.ts = order.ts;
    this.location = order.location;
    this.cardinals = order.cardinals;
    this.maker = order.maker;
    this.expiry = order.expiry;
    this.satoshi = order.satoshi;
    this.meta = order.meta;
  }

  static for(sado: SadoClient, record: OrderRecord): Order {
    const order = new Order(sado, record);
    order.cid = record.cid;
    order.signature = new Signature(record.signature, {
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
  getMessage(): string {
    return Buffer.from(
      JSON.stringify({
        type: this.type,
        ts: this.ts,
        location: this.location,
        cardinals: this.cardinals,
        maker: this.maker,
        expiry: this.expiry,
        satoshi: this.satoshi,
        meta: this.meta
      })
    ).toString("hex");
  }

  /**
   * Get a PSBT _(Partially Signed Bitcoin Transaction)_ used to sign the order for
   * future verification.
   *
   * The PSBT is a simple transaction with the location as input and an unspendable
   * output. The output is unspendable to prevent the order from being broadcast
   * while retaining the ability to verify the signature.
   *
   * @returns PSBT hex string.
   */
  async getPSBT(): Promise<string> {
    return this.sado.order.psbt(this.location, this.maker);
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
  sign(value: string, setting: SignatureSettings): this {
    this.signature = new Signature(value, setting);
    return this;
  }

  /**
   * Submit order to the API to generate a CID _(Content Identifier)_ which is
   * added to the order on success.
   *
   * Once the CID is generated the order CID can be relayed to the network.
   *
   * @returns Order instance.
   */
  async submit(): Promise<this> {
    this.cid = await this.sado.order.submit(this);
    return this;
  }

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
};

export type OrderSignature = {
  signature: string;
  signature_format?: string;
  pubkey?: string;
  desc?: string;
};
