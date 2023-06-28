import { OrderFilter } from "@sadoprotocol/sado-sdk";
import { Option } from "clipanion";

import { ApiCommand } from "../../ApiCommand";

export class GetOrderbookOrders extends ApiCommand {
  static paths = [["orderbook", "orders"]];

  address = Option.String();

  status = Option.String("--status", {
    required: false,
    description: "Order status to filter by."
  });

  type = Option.String("--type", {
    required: false,
    description: "Order type to filter by."
  });

  async execute(): Promise<void> {
    const filter: OrderFilter = {};

    const status = this.status;
    if (isOrderStatus(status)) {
      filter.status = status;
    }

    const type = this.type;
    if (isOrderType(type)) {
      filter["order.type"] = type;
    }

    try {
      console.log(await this.client.orderbook.orders(this.address, filter));
    } catch (error) {
      console.error(`Failed to retrieve orders: ${error.message}`);
    }
  }
}

function isOrderStatus(value: unknown): value is "pending" | "rejected" | "completed" {
  return value === "pending" || value === "rejected" || value === "completed";
}

function isOrderType(value: unknown): value is "sell" | "buy" {
  return value === "sell" || value === "buy";
}
