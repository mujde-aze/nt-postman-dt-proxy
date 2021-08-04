import * as functions from "firebase-functions";
import {ProxyResponse} from "./models/ProxyResponse";

export const postmanDtProxy = functions.region("australia-southeast1")
    .https.onCall((data, context) => {
      if (context.app == undefined) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called from a verified app."
        );
      }
      const proxyResponse: ProxyResponse = {
        message: "Received a valid message",
        statusCode: 200,
      };

      //    functions.logger.info("Hello logs!", {structuredData: true});
      return proxyResponse;
    });
