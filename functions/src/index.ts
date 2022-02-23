import * as functions from "firebase-functions";
import {TransferTokenGenerator} from "./model/TransferTokenGenerator";
import {ContactService} from "./service/ContactService";
import {PostmanState, resolvePostmanStateByValue} from "./model/PostmanState";
import * as dayjs from "dayjs";
import {UserService} from "./service/UserService";
import {FaithMilestone} from "./model/FaithMilestone";
import {ContactResponseTransformer} from "./service/ContactResponseTransformer";
import {sendSMS, smsBuilder} from "./service/SMSService";
import {validateArguments, verifyAuthentication} from "./service/VerificationService";

export const getDtContacts = functions.region("australia-southeast1")
    .https.onCall(async (data, context) => {
      verifyAuthentication(context);
      validateArguments(data, ["ntStatus"]);

      const transferTokenGenerator = initializeTransferTokenGenerator();
      const contactService = new ContactService(functions.config().dt.baseurl, transferTokenGenerator.getTransferToken());

      let userId = undefined;
      if (context.auth?.token.email && !shouldViewAllContacts(context.auth?.token.email)) {
        functions.logger.info(`Retrieving contacts assigned to ${context.auth?.token.email}`);

        const userService = new UserService(functions.config().dt.baseurl, transferTokenGenerator.getTransferToken());
        const user = await userService.getDTUserByEmail(context.auth?.token.email);
        userId = user.ID;
      } else {
        functions.logger.info(`${context.auth?.token.email} is in whitelist, retrieving all contacts for supplied status`);
      }

      const contactResponses = await contactService.getContactsByPostmanState(resolvePostmanStateByValue(data.ntStatus), userId);
      return ContactResponseTransformer.transformResponses(contactResponses);
    });

export const updateDtPostageStatus = functions.region("australia-southeast1")
    .https.onCall(async (data, context) => {
      verifyAuthentication(context);
      validateArguments(data, ["userId", "phone", "name", "trackingNumber"]);

      const transferTokenGenerator = initializeTransferTokenGenerator();
      const contactService = new ContactService(functions.config().dt.baseurl, transferTokenGenerator.getTransferToken());
      const postmanState = resolvePostmanStateByValue(data.ntStatus);
      await contactService.updateContactsPostmanState(postmanState, data.userId);

      if (postmanState === PostmanState.SENT) {
        // TODO: update custom field with tracking number
        await contactService.updateContactsFaithMilestone(FaithMilestone.HAS_BIBLE, data.userId);
        const sms = smsBuilder(data.phone, data.name, data.trackingNumber);
        await sendSMS(sms);
      }

      return "Success";
    });

function initializeTransferTokenGenerator(): TransferTokenGenerator {
  return new TransferTokenGenerator(functions.config().dt.token,
      functions.config().dt.site1, functions.config().dt.site2, dayjs.utc().format("YYYY-MM-DDHH"));
}

function shouldViewAllContacts(email: string) {
  const emailWhiteList = functions.config().dt.emailwhitelist.split(",");
  return emailWhiteList.includes(email);
}
