import * as functions from "firebase-functions";
import {TransferTokenGenerator} from "./model/TransferTokenGenerator";
import {ContactService} from "./service/ContactService";
import {resolveEnumByValue} from "./model/PostmanState";
import * as dayjs from "dayjs";
import {CallableContext} from "firebase-functions/lib/providers/https";
import {UserService} from "./service/UserService";

let transferTokenGenerator: TransferTokenGenerator;

export const getDtContacts = functions.region("australia-southeast1")
    .https.onCall(async (data, context) => {
      verifyAuthentication(context);
      const contactService = initializeContactService();

      if (data.userEmail != undefined && data.userEmail == context.auth?.token.email) {
        functions.logger.info(`Retrieving contacts assigned to ${data.userEmail}`);
        const userService = new UserService(functions.config().dt.baseUrl, transferTokenGenerator);
        const user = await userService.getDTUserByEmail(data.userEmail);
        return contactService.getContactsByPostmanState(resolveEnumByValue(data.ntStatus), user.ID);
      } else {
        return contactService.getContactsByPostmanState(resolveEnumByValue(data.ntStatus));
      }
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
  transferTokenGenerator = new TransferTokenGenerator(functions.config().dt.token,
      functions.config().dt.site1, functions.config().dt.site2, dayjs.utc().format("YYYY-MM-DDHH"));
  return new ContactService(functions.config().dt.baseurl, transferTokenGenerator);
}
