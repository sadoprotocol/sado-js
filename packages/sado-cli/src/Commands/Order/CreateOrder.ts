import { Order } from "@sadoprotocol/sado-sdk";
import { Option } from "clipanion";

import { ApiCommand } from "../../ApiCommand";

export class CreateOrder extends ApiCommand {
  static paths = [["order", "create"]];

  data = Option.String();

  async execute(): Promise<void> {
    try {
      const order = await Order.for(JSON.parse(Buffer.from(this.data, "base64").toString("utf-8")));
      console.log(await this.client.order.create(order, 15));
    } catch (error) {
      console.error(`Failed to create order: ${error.message}`);
    }
  }
}
