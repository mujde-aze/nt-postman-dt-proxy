import {PostmanState, resolveEnumByValue} from "../model/PostmanState";
import {HttpsError} from "firebase-functions/lib/providers/https";

describe("The postman state resolver", () => {
  it("Should return NONE if the value is none", () => {
    expect(resolveEnumByValue("none")).toBe(PostmanState.NONE);
  });
  it("Should return NEED if the value is needs_nt", () => {
    expect(resolveEnumByValue("needs_nt")).toBe(PostmanState.NEED);
  });
  it("Should return SENT if the value is nt_sent", () => {
    expect(resolveEnumByValue("nt_sent")).toBe(PostmanState.SENT);
  });
  it("Should return RECEIVED if the value is nt_received", () => {
    expect(resolveEnumByValue("nt_received")).toBe(PostmanState.RECEIVED);
  });
  it("Should throw an HttpsError for any other value", () => {
    expect(() => {
      resolveEnumByValue("some_garbage");
    }).toThrowError(HttpsError);
  });
});
