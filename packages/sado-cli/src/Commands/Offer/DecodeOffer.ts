import { Option } from "clipanion";

import { ApiCommand } from "../../ApiCommand";

export class DecodeOffer extends ApiCommand {
  static paths = [["offer", "decode"]];

  cid = Option.String();

  async execute(): Promise<void> {
    try {
      console.log(await this.client.offer.decode(this.cid));
    } catch (error) {
      console.error(`Failed to retrieve offer: ${error.message}`);
    }
  }
}
