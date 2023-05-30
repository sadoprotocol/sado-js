import { Option } from "clipanion";

import { ApiCommand } from "../../ApiCommand";

export class GetOrderbook extends ApiCommand {
  static paths = [["orderbook.get"]];

  address = Option.String();

  async execute(): Promise<void> {
    try {
      console.log(await this.client.orderbook.get(this.address));
    } catch (error) {
      console.error(`Failed to retrieve orderbook: ${error.message}`);
    }
  }
}
