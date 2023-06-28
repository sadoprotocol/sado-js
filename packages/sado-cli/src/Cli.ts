import { runExit } from "clipanion";

import { GetOffer } from "./Commands/Offer/GetOffer";
import { GetOfferPSBT } from "./Commands/Offer/GetOfferPSBT";
import { CreateOrder } from "./Commands/Order/CreateOrder";
import { GetOrder } from "./Commands/Order/GetOrder";
import { InitOrder } from "./Commands/Order/InitOrder";
import { GetOrderbookAnalytics } from "./Commands/Orderbook/GetAnalytics";
import { GetOrderbookOffers } from "./Commands/Orderbook/GetOffers";
import { GetOrderbook } from "./Commands/Orderbook/GetOrderbook";
import { GetOrderbookOrders } from "./Commands/Orderbook/GetOrders";

void runExit([
  InitOrder,
  CreateOrder,
  GetOrder,
  GetOfferPSBT,
  GetOffer,
  GetOrderbook,
  GetOrderbookAnalytics,
  GetOrderbookOrders,
  GetOrderbookOffers
]);
