import * as functions from "firebase-functions";
import * as twilio from "twilio";
import {SMS} from "../model/SMS";
import {FieldValue, firestore} from "../FirebaseAdmin";
import * as crypto from "crypto";
import {SMSRecord} from "../model/SMSRecord";

const MAX_SEND = 2;

const accountSid = functions.config().twilio.sid;
const accountToken = functions.config().twilio.token;
const messagingServiceSid = functions.config().twilio.messagingsid;
const client = twilio(accountSid, accountToken);

export async function sendSMS(sms: SMS): Promise<void> {
  const messageHash = hashSms(sms);
  const smsRecord = await getExistingSMSRecord(messageHash);

  if (smsRecord.count >= MAX_SEND) {
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

  if (smsRecord.id === "") {
    await addNewSMSRecord(smsRecord);
    return;
  }

  await updateExistingSMSRecord(smsRecord);
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
    name: name,
    body: message,
  };
}

function hashSms(sms: SMS): string {
  return crypto.createHash("sha256")
      .update(JSON.stringify(sms))
      .digest("hex");
}

async function getExistingSMSRecord(messageHash: string): Promise<SMSRecord> {
  const messageDetailsRef = await firestore.collection("MessageDetails")
      .where("messageHash", "==", messageHash)
      .get();

  if (messageDetailsRef.empty) {
    return {
      id: "",
      count: 0,
      messageHash: messageHash,
    };
  }

  return {
    id: messageDetailsRef.docs[0].id,
    count: messageDetailsRef.docs[0].data().sentCount,
    messageHash: messageDetailsRef.docs[0].data().messageHash,
  };
}

async function addNewSMSRecord(smsRecord: SMSRecord): Promise<void> {
  const storedDetails = await firestore.collection("MessageDetails")
      .add({
        messageHash: smsRecord.messageHash,
        sentCount: smsRecord.count,
        created: FieldValue.serverTimestamp(),
        updated: FieldValue.serverTimestamp(),
      });
  await updateSMSRecordCount(storedDetails.id);
}

async function updateSMSRecordCount(messageId: string): Promise<void> {
  await firestore.collection("MessageDetails").doc(messageId)
      .update({
        sentCount: FieldValue.increment(1),
        updated: FieldValue.serverTimestamp(),
      });
}

async function updateExistingSMSRecord(smsRecord: SMSRecord): Promise<void> {
  await firestore.collection("MessageDetails")
      .doc(smsRecord.id)
      .update({
        sentCount: FieldValue.increment(1),
        updated: FieldValue.serverTimestamp(),
      });
}
