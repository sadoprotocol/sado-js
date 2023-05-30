import { runExit } from "clipanion";

import { GetOffer } from "./Commands/Offer/GetOffer";
import { CreateOrder } from "./Commands/Order/CreateOrder/CreateOrder";
import { GetOrder } from "./Commands/Order/GetOrder";
import { SubmitOrder } from "./Commands/Order/SubmitOrder";
import { GetOrderbookAnalytics } from "./Commands/Orderbook/GetAnalytics";
import { GetOrderbookOffers } from "./Commands/Orderbook/GetOffers";
import { GetOrderbook } from "./Commands/Orderbook/GetOrderbook";
import { GetOrderbookOrders } from "./Commands/Orderbook/GetOrders";

void runExit([
  CreateOrder,
  SubmitOrder,
  GetOrder,
  GetOffer,
  GetOrderbook,
  GetOrderbookAnalytics,
  GetOrderbookOrders,
  GetOrderbookOffers
]);
