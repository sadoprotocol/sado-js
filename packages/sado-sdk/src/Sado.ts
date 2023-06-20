import { JsonRpc } from "./JsonRpc";
import { Network, NetworkMemoryProvider, NetworkProvider } from "./Network";
import { makeOfferService, OfferService } from "./Services/Offer";
import { makeOrderService, OrderService } from "./Services/Order";
import { makeOrderbookService, OrderbookService } from "./Services/Orderbook";

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

export class Sado {
  readonly rpc: JsonRpc;

  readonly order: OrderService;
  readonly offer: OfferService;
  readonly orderbook: OrderbookService;

  #network: NetworkProvider;

  constructor(readonly url: string, options?: Options) {
    this.rpc = new JsonRpc(url);
    this.order = makeOrderService(this);
    this.offer = makeOfferService(this);
    this.orderbook = makeOrderbookService(this);
    this.#network = options?.network ?? new NetworkMemoryProvider();
  }

  set network(value: Network) {
    this.#network.set(value);
  }

  get network() {
    return this.#network.get();
  }
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
  OrderService: typeof OrderService;
  OfferService: typeof OfferService;
  OrderbookService: typeof OrderbookService;
};
