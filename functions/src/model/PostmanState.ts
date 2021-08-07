import * as functions from "firebase-functions";

export enum PostmanState {
    NONE = "none",
    NEED = "needs_nt",
    SENT = "nt_sent",
    RECEIVED = "nt_received",
}

export function resolveEnumByValue(value: string): PostmanState {
  switch (value) {
    case "none":
      return PostmanState.NONE;
    case "needs_nt":
      return PostmanState.NEED;
    case "nt_sent":
      return PostmanState.SENT;
    case "nt_received":
      return PostmanState.RECEIVED;
    default:
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Postman state not recognized."
      );
  }
}
