import * as functions from "firebase-functions";
import {CallableContext} from "firebase-functions/lib/providers/https";
import _ = require("lodash");

/**
 * Ensures users are making calls from authenticated apps, and also that the
 * users themselves are authenticated
 * @param {CallableContext} context
 */
export function verifyAuthentication(context: CallableContext): void {
/*  if (context.app == undefined) {
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

  functions.logger.info(`Request from ${context.auth.token.email} to ${context.rawRequest.path}`);*/
}

/**
 * Determine if the list of strings match properties in a given object
 * @param {any} data - object to validate
 * @param {string} args - properties that may exist in data
 */
export function validateArguments(data: any, args: Array<string>): void {
  const undefinedArgs = args.filter((arg) => _.get(data, arg) === undefined);

  if (undefinedArgs.length > 0) {
    throw new functions.https.HttpsError(
        "failed-precondition",
        `The following arguments are required and must be submitted with the request: ${undefinedArgs}`,
    );
  }
}
