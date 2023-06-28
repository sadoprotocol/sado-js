import { Option } from "clipanion";

import { ApiCommand } from "../../ApiCommand";
import { confirmOrder } from "./Prompts/GetOrderConfirmation";
import { getSignature } from "./Prompts/GetSignature";
import { getSignatureFormat } from "./Prompts/GetSignatureFormat";

export class InitOrder extends ApiCommand {
  static paths = [["order", "init"]];

  readonly data = Option.String();

  async execute(): Promise<void> {
    print(`
      Sado Protocol > Create Order
    `);
    try {
      const order = this.client.order.init(JSON.parse(Buffer.from(this.data, "base64").toString("utf-8")));

      print("Creating order...");
      console.log(order.toJSON());

      print(`
        Collecting signature for order
      `);

      let signature = "";

      const format = await getSignatureFormat();
      switch (format) {
        case "psbt": {
          const psbt = await order.getPSBT();
          print(`
            Sign the following PSBT with your wallet:\n
            ${psbt}
          `);
          signature = await getSignature();
          break;
        }
        case "message": {
          const message = order.getMessage();
          print(`
            Sign the following message with your wallet:\n
            ${message}
          `);
          signature = await getSignature();
          break;
        }
      }

      if (!signature) {
        throw new Error("No signature provided");
      }

      order.sign(signature, {
        format
      });

      print(`
        Order is ready to be submitted, please make sure the order details are correct:
      `);
      console.log(order.toJSON());

      const submit = await confirmOrder();
      if (submit === false) {
        print("Order cancelled");
      } else {
        print("Creating order...");
        const { cid, psbt } = await order.create();
        print(`
          Order created successfully!

          CID  : ${cid}
          PSBT : ${psbt}

          Use "sado order get ${cid}" to view the order details, and once you are ready to broadcast the transaction. Use your wallet to sign and relay the to the network.
        `);
      }
    } catch (error) {
      console.error(`Failed to create order: ${error.message}`);
    }
  }
}

function print(value: string) {
  const message = [];
  for (const line of value.split("\n")) {
    message.push(line.trim());
  }
  console.log(message.join("\n"));
}