import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as md5 from "crypto-js/md5";

dayjs.extend(utc);

export class TransferTokenGenerator {
  constructor(public readonly token: string,
              public readonly site1: string,
              public readonly site2: string,
              public readonly formattedDate: string) {
    if (this.token == undefined || this.site1 == undefined || this.site2 == undefined) {
      throw new Error("Token arguments not set in environment.");
    }
  }

  getTransferToken(): string {
    const siteKey = md5(`${this.token}${this.site1}${this.site2}`);
    return md5(`${siteKey}${this.formattedDate}`).toString();
  }
}
