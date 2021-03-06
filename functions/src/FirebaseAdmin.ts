import * as admin from "firebase-admin";

admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({ignoreUndefinedProperties: true});
const FieldValue = admin.firestore.FieldValue;

const remoteConfig = admin.remoteConfig();

export {firestore, FieldValue, remoteConfig};
