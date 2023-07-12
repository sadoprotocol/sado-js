import { DEFAULT_NETWORK, isValidNetwork, Network, NetworkProvider } from "../Network";

export class LocalStorageProvider implements NetworkProvider {
  /**
   * Instantiates a new LocalStorageProvider instance.
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

  get storage() {
    const storage = globalThis.localStorage;
    if (storage === undefined) {
      throw new Error("LocalStorageProvider > could not retrieve storage, globalThis.localStorage is not available");
    }
    return storage;
  }

  set(value: Network) {
    this.storage.setItem("network", value);
  }

  get(): Network {
    const network = this.storage.getItem("network");
    if (network !== null) {
      if (isValidNetwork(network)) {
        return network;
      }
      this.storage.removeItem("network");
    }
    return DEFAULT_NETWORK;
  }
}
