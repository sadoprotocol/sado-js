import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import { NetworkMemoryProvider, Sado } from "@sadoprotocol/sdk";
import { Command } from "clipanion";

import { network, url } from "./Options";

export abstract class ApiCommand extends Command {
  private _url = url;
  private _network = network;

  get config(): Record<string, string> {
    const configPath = join(homedir(), ".sado");
    const configText = readFileSync(configPath, "utf-8");
    const config: Record<string, string> = {};
    for (const line of configText.split("\n")) {
      const [key, value] = line.split("=");
      if (key !== undefined && value !== undefined) {
        config[key] = value;
      }
    }
    return config;
  }

  get client(): Sado {
    return new Sado(this.url, { network: this.network });
  }

  get url(): string {
    if (this._url === undefined) {
      return this.config.url ?? "http://localhost:3030";
    }
    return this._url;
  }

  get network(): NetworkMemoryProvider {
    return new NetworkMemoryProvider(this.config.network ?? this._network);
  }
}
