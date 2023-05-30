import { Option } from "clipanion";

import { ApiCommand } from "../../ApiCommand";

export class SubmitOrder extends ApiCommand {
  static paths = [["order.submit"]];

  payload = Option.String;

  async execute(): Promise<void> {
    try {
      const order = await this.client.order.load(this.payload as any);
      console.log(await order.submit());
    } catch (error) {
      console.error(`Failed to create order: ${error.message}`);
    }
  }
}
