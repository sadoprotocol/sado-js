import { Option } from "clipanion";

import { ApiCommand } from "../../ApiCommand";

export class GetOffer extends ApiCommand {
  static paths = [["offer", "get"]];

  cid = Option.String();

  async execute(): Promise<void> {
    try {
      console.log(await this.client.offer.get(this.cid));
    } catch (error) {
      console.error(`Failed to retrieve offer: ${error.message}`);
    }
  }
}
