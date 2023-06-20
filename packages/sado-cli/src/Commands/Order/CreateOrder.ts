import { Option } from "clipanion";

import { ApiCommand } from "../../ApiCommand";

export class CreateOrder extends ApiCommand {
  static paths = [["order", "create"]];

  data = Option.String();

  async execute(): Promise<void> {
    try {
      const order = await this.client.order.load(JSON.parse(Buffer.from(this.data, "base64").toString("utf-8")));
      console.log(await order.create());
    } catch (error) {
      console.error(`Failed to create order: ${error.message}`);
    }
  }
}
