import * as functions from "firebase-functions";
import {TransferTokenGenerator} from "./model/TransferTokenGenerator";
import {DTRequestService} from "./service/DTRequestService";
import {resolveEnumByValue} from "./model/PostmanState";
import * as dayjs from "dayjs";

const transferTokenGenerator = new TransferTokenGenerator(functions.config().dt.token,
    functions.config().dt.site1, functions.config().dt.site2);
const dtService = new DTRequestService(functions.config().dt.baseurl, transferTokenGenerator);

export const getDtContacts = functions.region("australia-southeast1")
    .https.onCall((data, context) => {
      if (context.app == undefined) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called from a verified app."
        );
      }

      transferTokenGenerator.formattedDate = dayjs.utc().format("YYYY-MM-DDHH");
      return dtService.getContactsByPostmanState(resolveEnumByValue(data.ntStatus));
    });

export const updateDtPostageStatus = functions.region("australia-southeast1")
    .https.onCall((data, context) => {
      if (context.app == undefined) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called from a verified app."
        );
      }

      transferTokenGenerator.formattedDate = dayjs.utc().format("YYYY-MM-DDHH");
      return dtService.updateContactsPostmanState(resolveEnumByValue(data.ntStatus), data.userId);
    });
