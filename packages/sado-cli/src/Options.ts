import { Option } from "clipanion";

export const url = Option.String("--url", {
  required: false,
  description: "The API to connect to, eg. https://api.sado.io. Default: http://localhost:3030"
});

export const network = Option.String("--network", {
  required: false,
  description: "The network to connect to, eg. mainnet,testnet,regtest. Default: mainnet"
});
