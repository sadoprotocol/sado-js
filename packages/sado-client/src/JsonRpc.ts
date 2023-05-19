import fetch from "cross-fetch";

import { Network } from "./Network";

export class JsonRpc {
  #network: NetworkProvider;

  constructor(readonly url: string, network: NetworkProvider) {
    this.#network = network;
  }

  get id() {
    return Math.floor(Math.random() * 100000);
  }

  set network(value: Network) {
    this.#network.set(value);
  }

  get network() {
    return this.#network.get();
  }

  /**
   * Send a JSON-RPC 2.0 notification to the connected Sado compliant server.
   *
   * @param method - Method to call.
   * @param params - JSON-RPC 2.0 parameters.
   */
  notify(method: string, params?: Params): void {
    fetch(`${this.url}/rpc${getQueryString({ network: this.network })}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method,
        params
      })
    });
  }

  async call<T>(method: string, id: Id): Promise<T>;
  async call<T>(method: string, params: Params, id: Id): Promise<T>;
  async call<T>(method: string, paramsOrId: Params | Id, id?: Id): Promise<T> {
    let params: Params = {};
    if (isJsonRpcId(paramsOrId)) {
      id = paramsOrId;
    } else {
      params = paramsOrId;
    }
    const response = await fetch(`${this.url}/rpc${getQueryString({ network: this.network })}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method,
        params,
        id
      })
    });
    if (response.status === 200) {
      const json = await response.json();
      if (json.error) {
        throw new Error(json.error.message);
      }
      return json.result;
    }
    throw new Error(`Internal Server Error`);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function getQueryString(params: Record<string, any>): string {
  const query: string[] = [];
  for (const key in params) {
    query.push(`${key}=${encodeURIComponent(params[key])}`);
  }
  if (query.length) {
    return `?${query.join("&")}`;
  }
  return "";
}

function isJsonRpcId(value: unknown): value is Id {
  return isString(value) || isInteger(value) || value === null;
}

function isInteger(value: any): value is number {
  return isNumber(value) && value % 1 === 0;
}

function isNumber(value: any): value is number {
  const type = typeof value;
  return type === "number" && value > Number.NEGATIVE_INFINITY && value < Number.POSITIVE_INFINITY;
}

function isString(value: any): value is string {
  return typeof value === "string";
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Id = string | number | null;

export type Params = unknown[] | Record<string, any>;

export type NetworkProvider = {
  set(value: Network): void;
  get(): Network;
};
