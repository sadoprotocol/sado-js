import clipboard from "clipboardy";

import { ApiCommand } from "../../../ApiCommand";
import { confirmOrder } from "./Prompts/GetOrderConfirmation";
import { getOrderPayload } from "./Prompts/GetOrderPayload";
import { getSignature } from "./Prompts/GetSignature";
import { getSignatureFormat } from "./Prompts/GetSignatureFormat";

export class CreateOrder extends ApiCommand {
  static paths = [["order.create"]];

  async execute(): Promise<void> {
    print(`
      Sado Protocol > Create Order
    `);
    try {
      const [data, maker] = await getOrderPayload();
      const order = this.client.order.create(data);

      print(`
        Collecting signature for order
      `);

      let signature = "";

      const format = await getSignatureFormat();
      switch (format) {
        case "psbt": {
          if (maker.type === "p2pkh") {
            throw new Error("PSBT signing is not supported for P2PKH addresses");
          }
          const psbt = await order.getPSBT();
          clipboard.writeSync(psbt);
          print(`
            Sign the following PSBT with your private key:\n
            ${psbt}
          `);
          signature = await getSignature();
          break;
        }
        case "message": {
          const message = order.getMessage();
          clipboard.writeSync(message);
          print(`
            Sign the following message with your private key:\n
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
      }

      await order.submit();

      console.log(order.toJSON());
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
