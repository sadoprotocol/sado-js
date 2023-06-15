import type { Offer } from "../Models/Offer";
import type { SadoClient } from "../SadoClient";

export class OfferService {
  constructor(readonly sado: SadoClient) {}

  /**
   * Retrieve an offer by its CID _(Content Identifier)_.
   *
   * @param cid - Content identifier of offer.
   *
   * @returns Offer result.
   */
  async get(cid: string): Promise<Offer> {
    return this.sado.rpc.call<Offer>("offer.getOffer", { cid }, this.sado.rpc.id);
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
    return this.sado.rpc.call<Offer>("offer.decode", { cid }, this.sado.rpc.id);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Service Composer
 |--------------------------------------------------------------------------------
 */

export function makeOfferService(sado: SadoClient, Service = OfferService) {
  return new Service(sado);
}
