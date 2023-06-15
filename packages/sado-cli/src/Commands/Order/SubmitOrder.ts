import { Option } from "clipanion";

import { ApiCommand } from "../../ApiCommand";

export class SubmitOrder extends ApiCommand {
  static paths = [["order", "submit"]];

  data = Option.String();

  async execute(): Promise<void> {
    try {
      const order = await this.client.order.load(JSON.parse(Buffer.from(this.data, "base64").toString("utf-8")));
      console.log(await order.submit());
    } catch (error) {
      console.error(`Failed to create order: ${error.message}`);
    }
  }
}
