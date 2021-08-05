import {TransferTokenGenerator} from "../model/TransferTokenGenerator";

describe("Calling generateTransferToken", () => {
  const token = "AFED3E1313";
  const site1 = "site1.com";
  const site2 = "site2.com";
  const formattedDate = "2021-08-0608";
  const transferTokenGenerator = new TransferTokenGenerator(token, site1, site2, formattedDate);
  it("Should return a valid transfer token", () => {
    const transferToken = transferTokenGenerator.getTransferToken();
    expect(transferToken).toBe("8832676c51ed9c011b1d9ff322c608fc");
  });
});
