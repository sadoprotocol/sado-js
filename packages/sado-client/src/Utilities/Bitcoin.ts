const addressFormats = {
  mainnet: {
    p2pkh: /^[1][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    p2sh: /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    bech32: /^(bc1)[a-zA-HJ-NP-Z0-9]{39,58}$/
  },
  other: {
    p2pkh: /^[mn][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    p2sh: /^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    bech32: /^(tb1|bcrt1)[a-zA-HJ-NP-Z0-9]{39,58}$/
  }
} as const;

export function getBitcoinAddress(value: string): Address | false {
  for (const network of Object.keys(addressFormats) as ["mainnet", "other"]) {
    if (addressFormats[network].p2pkh.test(value)) {
      return {
        address: value,
        type: "p2pkh"
      };
    }
    if (addressFormats[network].p2sh.test(value)) {
      return {
        address: value,
        type: "p2sh"
      };
    }
    if (addressFormats[network].bech32.test(value)) {
      return {
        address: value,
        type: "bech32"
      };
    }
  }
  return false;
}

export type Address = {
  address: string;
  type: "p2pkh" | "p2sh" | "bech32";
};
