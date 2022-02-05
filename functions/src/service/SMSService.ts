import * as functions from "firebase-functions";
import * as twilio from "twilio";
import {SMS} from "../model/SMS";

const accountSid = functions.config().twilio.sid;
const accountToken = functions.config().twilio.token;
const messagingServiceSid = functions.config().twilio.messagingsid;
const client = twilio(accountSid, accountToken);

export async function sendSMS(sms: SMS): Promise<void> {
  try {
    const message = await client.messages.create({
      to: sms.to,
      body: sms.body,
      messagingServiceSid: messagingServiceSid,
    });
    functions.logger.info(`Successfully sent SMS to ${sms.to}, received sid: ${message.sid}`);
  } catch (error) {
    functions.logger.error(`Failed to send SMS to ${sms.to}. Error received: ${JSON.stringify(error)}`);
    throw new functions.https.HttpsError("internal", "Failed to send SMS", error);
  }
}

export function smsBuilder(phone: string, name: string, trackingNumber: string): SMS {
  return {
    to: phone,
    body: `Hi ${name}, your NT has been sent. The tracking number is ${trackingNumber}.`,
  };
}
