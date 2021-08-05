import * as crypto from "crypto";
import * as dayjs from "dayjs";

export class TransferTokenGenerator {
  constructor(public readonly token: string,
              public readonly site1: string,
              public readonly site2: string) {
    if (this.token == undefined || this.site1 == undefined || this.site2 == undefined) {
      throw new Error("Token arguments not set in environment.");
    }
  }

  getTransferToken(): string {
    return `${this.generateSiteKey()}${this.formatKeyDate()}`;
  }

  private generateSiteKey(): string {
    const md5Sum = crypto.createHash("md5");
    return md5Sum.update(`${this.token}${this.site1}${this.site2}`).digest("hex");
  }

  private formatKeyDate():string {
    return dayjs().format("YYYY-MM-DDHH");
  }
}
