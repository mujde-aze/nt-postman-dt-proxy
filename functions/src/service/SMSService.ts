import * as functions from "firebase-functions";
import * as twilio from "twilio";
import {SMS} from "../model/SMS";
import {FieldValue, firestore} from "../FirebaseAdmin";
import * as crypto from "crypto";

const MAX_SEND = 2;

const accountSid = functions.config().twilio.sid;
const accountToken = functions.config().twilio.token;
const messagingServiceSid = functions.config().twilio.messagingsid;
const client = twilio(accountSid, accountToken);

export async function sendSMS(sms: SMS): Promise<void> {
  const messageHash = hashSms(sms);
  const sentCount = await getMessageSentCount(messageHash);

  if (sentCount >= MAX_SEND) {
    throw new functions.https.HttpsError("resource-exhausted", `Exceeded the maximum number of messages you can send to ${sms.to}`);
  }

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

  await storeMessageDetails(messageHash, sentCount);
}

export function smsBuilder(phone: string, name: string, trackingNumber: string): SMS {
  let message = `Salam! Sizə İsanın Həyatı səhifəsindən kitabınız göndərildi. 
  Poçt izləmə kodunuz ${trackingNumber} www.azerpost.az/az/tracking Linkə vur, İncilin haradadır bax!`;

  if (trackingNumber === "" || trackingNumber === undefined) {
    message = "Salam! Sizə İsanın Həyatı səhifəsindən kitabınız göndərildi. \n" +
        "Yaxın vaxtda poçtdan sizə xəbər gəlməsə bu nömrə ilə əlaqə saxlayın.";
  }

  return {
    to: phone,
    body: message,
  };
}

function hashSms(sms: SMS): string {
  return crypto.createHash("sha256")
      .update(JSON.stringify(sms))
      .digest("hex");
}

async function getMessageSentCount(messageHash: string): Promise<number> {
  const messageDetailsRef = await firestore.collection("MessageDetails")
      .where("messageHash", "==", messageHash)
      .get();

  if (messageDetailsRef.empty) {
    return 0;
  }

  return messageDetailsRef.docs[0].data().sentCount;
}

async function storeMessageDetails(messageHash: string, sentCount: number): Promise<void> {
  const storedDetails = await firestore.collection("MessageDetails")
      .add({
        messageHash: messageHash,
        sentCount: sentCount,
        created: FieldValue.serverTimestamp(),
        updated: FieldValue.serverTimestamp(),
      });
  await updateMessageSentCount(storedDetails.id);
}

async function updateMessageSentCount(messageId: string): Promise<void> {
  await firestore.collection("MessageDetails").doc(messageId)
      .update({
        sentCount: FieldValue.increment(1),
        updated: FieldValue.serverTimestamp(),
      });
}
