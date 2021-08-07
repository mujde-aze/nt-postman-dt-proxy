import * as functions from "firebase-functions";
import {TransferTokenGenerator} from "./model/TransferTokenGenerator";
import {ContactService} from "./service/ContactService";
import {resolveEnumByValue} from "./model/PostmanState";
import * as dayjs from "dayjs";
import {CallableContext} from "firebase-functions/lib/providers/https";

export const getDtContacts = functions.region("australia-southeast1")
    .https.onCall((data, context) => {
      verifyAuthentication(context);
      const contactService = initializeContactService();

      return contactService.getContactsByPostmanState(resolveEnumByValue(data.ntStatus));
    });

export const updateDtPostageStatus = functions.region("australia-southeast1")
    .https.onCall((data, context) => {
      verifyAuthentication(context);
      const contactService = initializeContactService();

      return contactService.updateContactsPostmanState(resolveEnumByValue(data.ntStatus), data.userId);
    });

function verifyAuthentication(context: CallableContext) {
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called from a verified app."
    );
  }

  if (context.auth == undefined) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be authenticated to make this call."
    );
  }

  functions.logger.info(`Request from ${context.auth.token.email} to ${context.rawRequest.path}`);
}

function initializeContactService(): ContactService {
  const transferTokenGenerator = new TransferTokenGenerator(functions.config().dt.token,
      functions.config().dt.site1, functions.config().dt.site2, dayjs.utc().format("YYYY-MM-DDHH"));
  return new ContactService(functions.config().dt.baseurl, transferTokenGenerator);
}
