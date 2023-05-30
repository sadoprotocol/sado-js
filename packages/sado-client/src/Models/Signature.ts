export class Signature {
  constructor(readonly value: string, readonly settings?: SignatureSettings) {}

  get format(): string | undefined {
    return this.settings?.format;
  }

  get desc(): string | undefined {
    return this.settings?.desc;
  }

  toJSON() {
    return {
      value: this.value,
      format: this.format,
      desc: this.desc
    };
  }
}

export type SignatureSettings = {
  format?: string;
  desc?: string;
};
