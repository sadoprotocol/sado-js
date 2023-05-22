import { Option } from "clipanion";

import { ApiCommand } from "../ApiCommand";

export class OrderGet extends ApiCommand {
  static paths = [["order.get"]];

  cid = Option.String();

  async execute(): Promise<void> {
    try {
      console.log(await this.client.order.get(this.cid));
    } catch (error) {
      console.error(`Failed to retrieve order: ${error.message}`);
    }
  }
}

export const order = [OrderGet];
