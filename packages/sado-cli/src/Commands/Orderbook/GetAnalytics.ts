import { Option } from "clipanion";

import { ApiCommand } from "../../ApiCommand";

export class GetOrderbookAnalytics extends ApiCommand {
  static paths = [["orderbook", "analytics"]];

  address = Option.String();

  async execute(): Promise<void> {
    try {
      console.log(await this.client.orderbook.analytics(this.address));
    } catch (error) {
      console.error(`Failed to retrieve orderbook analytics: ${error.message}`);
    }
  }
}
