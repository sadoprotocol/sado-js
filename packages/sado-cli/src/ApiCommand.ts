import { NetworkMemoryProvider, SadoClient } from "@sado/client";
import { Command } from "clipanion";

import { network, url } from "./Options";

export abstract class ApiCommand extends Command {
  private _url = url;
  private _network = network;

  get client(): SadoClient {
    return new SadoClient(this.url, { network: this.network });
  }

  get url(): string {
    if (this._url === undefined) {
      return "http://localhost:3030";
    }
    return this._url;
  }

  get network(): NetworkMemoryProvider {
    return new NetworkMemoryProvider(this._network);
  }
}
