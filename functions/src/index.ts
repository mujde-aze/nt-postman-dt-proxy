import * as functions from "firebase-functions";
import {TransferTokenGenerator} from "./model/TransferTokenGenerator";
import {DTRequestService} from "./service/DTRequestService";

const transferTokenGenerator = new TransferTokenGenerator(functions.config().dt.token,
    functions.config().dt.site1, functions.config().dt.site2);

export const getDtContacts = functions.region("australia-southeast1")
    .https.onCall((data, context) => {
      if (context.app == undefined) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called from a verified app."
        );
      }

      const dtService = new DTRequestService(functions.config().dt.baseurl, transferTokenGenerator);

      return dtService.getContactsByPostmanState(data.ntStatus);

      //    functions.logger.info("Hello logs!", {structuredData: true});
    });

export const updateDtPostageStatus = functions.region("australia-southeast1")
    .https.onCall((data, context) => {
      if (context.app == undefined) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called from a verified app."
        );
      }

      return {
        message: "Received a valid message to update postage state.",
        statusCode: 200,
      };
    });
