export class Signature {
  constructor(readonly value: string, readonly settings?: SignatureSettings) {}

  get format(): string | undefined {
    return this.settings?.format;
  }

  get desc(): string | undefined {
    return this.settings?.desc;
  }

  get pubkey(): string | undefined {
    return this.settings?.pubkey;
  }

  toJSON() {
    return {
      value: this.value,
      format: this.format,
      desc: this.desc,
      pubkey: this.pubkey
    };
  }
}

export type SignatureSettings = {
  format?: string;
  desc?: string;
  pubkey?: string;
};
