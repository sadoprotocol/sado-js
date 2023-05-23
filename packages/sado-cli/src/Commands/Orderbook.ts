import { OrderFilter } from "@sado/client";
import { Option } from "clipanion";

import { ApiCommand } from "../ApiCommand";

class OrderbookAnalytics extends ApiCommand {
  static paths = [["orderbook.analytics"]];

  address = Option.String();

  async execute(): Promise<void> {
    try {
      console.log(await this.client.orderbook.analytics(this.address));
    } catch (error) {
      console.error(`Failed to retrieve orderbook analytics: ${error.message}`);
    }
  }
}

class OrderbookGet extends ApiCommand {
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

class OrderbookOrders extends ApiCommand {
  static paths = [["orderbook.orders"]];

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

class OrderbookOffers extends ApiCommand {
  static paths = [["orderbook.offers"]];

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
      console.log(await this.client.orderbook.offers(this.address, filter));
    } catch (error) {
      console.error(`Failed to retrieve offers: ${error.message}`);
    }
  }
}

function isOrderStatus(value: unknown): value is "pending" | "rejected" | "completed" {
  return value === "pending" || value === "rejected" || value === "completed";
}

function isOrderType(value: unknown): value is "sell" | "buy" {
  return value === "sell" || value === "buy";
}

export const orderbook = [OrderbookAnalytics, OrderbookGet, OrderbookOrders, OrderbookOffers];
