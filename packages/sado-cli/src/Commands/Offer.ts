import { Option } from "clipanion";

import { ApiCommand } from "../ApiCommand";

export class OfferGet extends ApiCommand {
  static paths = [["offer.get"]];

  cid = Option.String();

  async execute(): Promise<void> {
    try {
      console.log(await this.client.offer.get(this.cid));
    } catch (error) {
      console.error(`Failed to retrieve offer: ${error.message}`);
    }
  }
}

export class OfferDecode extends ApiCommand {
  static paths = [["offer.decode"]];

  cid = Option.String();

  async execute(): Promise<void> {
    try {
      console.log(await this.client.offer.decode(this.cid));
    } catch (error) {
      console.error(`Failed to retrieve offer: ${error.message}`);
    }
  }
}

export const offer = [OfferGet, OfferDecode];
