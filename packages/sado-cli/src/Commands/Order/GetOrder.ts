import { Option } from "clipanion";

import { ApiCommand } from "../../ApiCommand";

export class GetOrder extends ApiCommand {
  static paths = [["order.get"]];

  cid = Option.String();

  async execute(): Promise<void> {
    try {
      const order = await this.client.order.get(this.cid);
      if (order !== undefined) {
        console.log(order.toJSON());
      }
    } catch (error) {
      console.error(`Failed to retrieve order: ${error.message}`);
    }
  }
}
