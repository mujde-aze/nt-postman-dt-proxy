import * as functions from "firebase-functions";

export const getDtContacts = functions.region("australia-southeast1")
    .https.onCall((data, context) => {
      if (context.app == undefined) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called from a verified app."
        );
      }
      return {
        message: "Received a valid message to retrieve contacts",
        statusCode: 200,
      };

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
