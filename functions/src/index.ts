import * as functions from "firebase-functions";
import {TransferTokenGenerator} from "./model/TransferTokenGenerator";
import {ContactService} from "./service/ContactService";
import {PostmanState, resolvePostmanStateByValue} from "./model/PostmanState";
import * as dayjs from "dayjs";
import {CallableContext} from "firebase-functions/lib/providers/https";
import {UserService} from "./service/UserService";
import {FaithMilestone, resolveMilestoneByValue} from "./model/FaithMilestone";

export const getDtContacts = functions.region("australia-southeast1")
    .https.onCall(async (data, context) => {
      verifyAuthentication(context);

      const transferTokenGenerator = initializeTransferTokenGenerator();
      const contactService = new ContactService(functions.config().dt.baseurl, transferTokenGenerator.getTransferToken());

      if (data.assignedToMe && context.auth?.token.email) {
        functions.logger.info(`Retrieving contacts assigned to ${context.auth?.token.email}`);

        const userService = new UserService(functions.config().dt.baseurl, transferTokenGenerator.getTransferToken());
        const user = await userService.getDTUserByEmail(context.auth?.token.email);
        return contactService.getContactsByPostmanState(resolvePostmanStateByValue(data.ntStatus), user.ID);
      } else {
        return contactService.getContactsByPostmanState(resolvePostmanStateByValue(data.ntStatus));
      }
    });

export const updateDtPostageStatus = functions.region("australia-southeast1")
    .https.onCall((data, context) => {
      verifyAuthentication(context);

      const transferTokenGenerator = initializeTransferTokenGenerator();
      const contactService = new ContactService(functions.config().dt.baseurl, transferTokenGenerator.getTransferToken());
      const postmanState = resolvePostmanStateByValue(data.ntStatus);
      const updateStateResponse = contactService.updateContactsPostmanState(postmanState, data.userId);

      if (postmanState === PostmanState.RECEIVED) {
        return contactService.updateContactsFaithMilestone(FaithMilestone.HAS_BIBLE, data.userId);
      }

      return updateStateResponse;
    });

export const updateFaithMilestone = functions.region("australia-southeast1")
    .https.onCall((data, context) => {
      verifyAuthentication(context);

      const transferTokenGenerator = initializeTransferTokenGenerator();
      const contactService = new ContactService(functions.config().dt.baseurl, transferTokenGenerator.getTransferToken());

      return contactService.updateContactsFaithMilestone(resolveMilestoneByValue(data.faithMilestone), data.userId);
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

function initializeTransferTokenGenerator(): TransferTokenGenerator {
  return new TransferTokenGenerator(functions.config().dt.token,
      functions.config().dt.site1, functions.config().dt.site2, dayjs.utc().format("YYYY-MM-DDHH"));
}
