import { runExit } from "clipanion";

import { offer } from "./Commands/Offer";
import { order } from "./Commands/Order";
import { orderbook } from "./Commands/Orderbook";

void runExit([...order, ...offer, ...orderbook]);
