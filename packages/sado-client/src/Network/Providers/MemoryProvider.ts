import { DEFAULT_NETWORK, isValidNetwork, Network } from "../Network";

export class NetworkMemoryProvider {
  #value: Network = DEFAULT_NETWORK;

  constructor(value?: string) {
    if (value !== undefined) {
      if (!isValidNetwork(value)) {
        throw new Error(`Invalid network: ${value}`);
      }
      this.#value = value;
    }
  }

  set(value: Network) {
    this.#value = value;
  }

  get(): Network {
    return this.#value;
  }
}
