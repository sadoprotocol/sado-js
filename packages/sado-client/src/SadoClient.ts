import { JsonRpc, NetworkProvider } from "./JsonRpc";
import { Lookup } from "./Lookup";
import { DEFAULT_NETWORK, Network } from "./Network";

/*
 |--------------------------------------------------------------------------------
 | Sado Client
 |--------------------------------------------------------------------------------
 |
 | This provides a mutable instance of the sado client for use in your application.
 | It is designed to be used as a singleton with context switching mechanisms on
 | the top layer. This allows for a single instance of the client to be used
 | enabling easier consumption of ecosystem services without having to add in
 | additional logic to pass into each service method.
 |
 | Current Features:
 |
 |  - Network Switching
 |
 |    To switch the network context you can now simply assign a new network
 |    to the SDK instance. Example: `sado.network = "mainnet"` which will
 |    reflect into any subsequent service calls.
 |
 */

export class SadoClient {
  readonly lookup: Lookup;
  readonly rpc: JsonRpc;

  constructor(readonly url: string, options?: Options) {
    this.rpc = new JsonRpc(url, options?.network ?? getNetworkSwitcher());
    this.lookup = makeLookupService(this);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Service Composers
 |--------------------------------------------------------------------------------
 |
 | To allow for easier composition of service implementations the developer can
 | instantiate their own SADO SDK instance and pass in their own service handlers.
 | This is especially useful for testing and mocking the services.
 |
 */

function getNetworkSwitcher(value: Network = DEFAULT_NETWORK) {
  return {
    value,
    set(value: Network) {
      this.value = value;
    },
    get(): Network {
      return this.value;
    }
  };
}

function makeLookupService(sado: SadoClient, Service = Lookup) {
  return new Service(sado);
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Options = {
  network?: NetworkProvider;
  services?: Services;
};

type Services = {
  Lookup: typeof Lookup;
};
