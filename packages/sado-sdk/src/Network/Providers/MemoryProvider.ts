import { DEFAULT_NETWORK, isValidNetwork, Network, NetworkProvider } from "../Network";

export class NetworkMemoryProvider implements NetworkProvider {
  #value: Network = DEFAULT_NETWORK;

  /**
   * Instantiates a new NetworkMemoryProvider instance.
   *
   * @param value - Initial network value.
   */
  constructor(value?: string) {
    if (value !== undefined) {
      if (!isValidNetwork(value)) {
        throw new Error(`Invalid network: ${value}`);
      }
      this.set(value);
    }
  }

  set(value: Network) {
    this.#value = value;
  }

  get(): Network {
    return this.#value;
  }
}
