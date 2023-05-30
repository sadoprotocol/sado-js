import { Address, getBitcoinAddress } from "@sado/client";
import inquirer from "inquirer";

const prompt = inquirer.createPromptModule();

const questions = [
  {
    type: "list",
    name: "type",
    message: "Select order type:",
    prefix: "📦",
    choices: ["sell", "buy"]
  },
  {
    type: "input",
    name: "location",
    message: "Enter ordinal location:",
    prefix: "🌐",
    validate: (value: string) => {
      if (RegExp(/^[a-f0-9]{64}:[0-9]+$/).test(value) === false) {
        return "Invalid location format provided. Format: txid:vout";
      }
      return true;
    }
  },
  {
    type: "number",
    name: "cardinals",
    message: "Enter lowest asking price:",
    prefix: "💸",
    validate: (value: number) => {
      if (value < 1) {
        return "Cardinal value must be greater than 0";
      }
      return true;
    }
  },
  {
    type: "input",
    name: "maker",
    message: "Enter ordinal owner address:",
    prefix: "👤",
    filter: (value: string) => {
      return getBitcoinAddress(value);
    },
    validate: (value: any) => {
      if (value === false) {
        return "Invalid maker address provided.";
      }
      return true;
    },
    transformer: (value: any) => {
      if (typeof value === "object") {
        return value.address;
      }
      return value;
    }
  },
  {
    type: "input",
    name: "expiry",
    message: "[Optional] At what block height should the order expire?",
    prefix: "⏱️"
  },
  {
    type: "input",
    name: "meta",
    message: "[Optional] Enter order metadata (JSON):",
    prefix: "📝",
    validate: (value: string) => {
      if (!value) {
        return true;
      }
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        return "Invalid JSON format provided.";
      }
    }
  }
];

export async function getOrderPayload(): Promise<[OrderPayload, Address]> {
  const data = await prompt(questions);
  data.ts = Math.floor(Date.now() / 1000);
  if (data.expiry === "") {
    delete data.expiry;
  }
  if (data.meta) {
    data.meta = JSON.parse(data.meta);
  } else {
    delete data.meta;
  }
  const maker = data.maker;
  data.maker = maker.address;
  return [data, maker];
}

export type OrderPayload = {
  type: "sell" | "buy";
  ts: number;
  location: string;
  cardinals: number;
  maker: string;
  expiry?: number;
  satoshi?: number;
  meta?: Record<string, any>;
};
