import type { Offer } from "../Models/Offer";
import type { Sado } from "../Sado";

export class OfferService {
  constructor(readonly sado: Sado) {}

  /**
   * Create a new offer PSBT ready to sign and relay to the blockchain.
   *
   * @param params - Request parameters submit to the API for offer creation.
   *
   * @returns cid and psbt of the offer.
   */
  async create(params: OfferParams): Promise<OfferResponse> {
    return this.sado.rpc.call<OfferResponse>(
      "CreateOffer",
      {
        network: this.sado.network,
        ts: Date.now(),
        ...params
      },
      this.sado.rpc.id
    );
  }

  /**
   * Get a signable PSBT for a order maker to sign and relay to the blockchain on the
   * acceptance of the transaction.
   *
   * @param params - Request parameters submit to the API for PSBT creation.
   *
   * @returns base64 encoded PSBT string.
   */
  async getOfferPsbt(params: OfferPsbtParams): Promise<OfferPsbtResponse> {
    return this.sado.rpc.call<OfferPsbtResponse>(
      "CreateOfferPsbt",
      {
        network: this.sado.network,
        ...params
      },
      this.sado.rpc.id
    );
  }

  /**
   * Retrieve an offer by its CID _(Content Identifier)_.
   *
   * @param cid - Content identifier of offer.
   *
   * @returns Offer result.
   */
  async get(cid: string): Promise<Offer> {
    return this.sado.rpc.call<Offer>("GetOffer", { cid }, this.sado.rpc.id);
  }

  /**
   * Retrieve an offer data by its CID _(Content Identifier)_ and decode the
   * PSBT on the offer key.
   *
   * @param cid - Content identifier of offer.
   *
   * @returns Decoded offer result.
   */
  async decode(cid: string): Promise<any> {
    return this.sado.rpc.call<Offer>("DecodeOffer", { cid }, this.sado.rpc.id);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Service Composer
 |--------------------------------------------------------------------------------
 */

export function makeOfferService(sado: Sado, Service = OfferService) {
  return new Service(sado);
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type OfferParams = {
  origin: string;
  offer: string;
  taker: string;
  orderbooks?: string[];
  fees: {
    network: number;
    rate: number;
  };
};

type OfferResponse = {
  cid: string;
  psbt: string;
};

type OfferPsbtParams = {
  cid: string;
  taker: string;
  cardinals: number;
  fees: {
    network: number;
    rate: number;
  };
};

type OfferPsbtResponse = {
  psbt: string;
};
