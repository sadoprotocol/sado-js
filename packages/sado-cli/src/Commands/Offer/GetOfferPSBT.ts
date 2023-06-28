import { Option } from "clipanion";
import { isNumber } from "typanion";

import { ApiCommand } from "../../ApiCommand";

export class GetOfferPSBT extends ApiCommand {
  static paths = [["offer", "psbt"]];

  cid = Option.String();
  taker = Option.String();
  cardinals = Option.String({ validator: isNumber() });
  feeNetwork = Option.String({ validator: isNumber() });
  feeRate = Option.String({ validator: isNumber() });

  async execute(): Promise<void> {
    try {
      console.log(
        await this.client.offer.getOfferPsbt({
          cid: this.cid,
          taker: this.taker,
          cardinals: this.cardinals,
          fees: {
            network: this.feeNetwork,
            rate: this.feeRate
          }
        })
      );
    } catch (error) {
      console.error(`Failed to retrieve offer: ${error.message}`);
    }
  }
}
