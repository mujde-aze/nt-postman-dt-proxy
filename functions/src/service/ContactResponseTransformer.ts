import {ActivityResponse} from "../model/ActivityResponse";
import * as dayjs from "dayjs";
import {ContactResponse} from "../model/ContactResponse";
import {Contact} from "../model/Contact";
import {ContactService} from "./ContactService";
import * as functions from "firebase-functions";

export class ContactResponseTransformer {
  static async transformResponses(contactResponses: ContactResponse[], contactService: ContactService): Promise<Contact[]> {
    functions.logger.debug(`Initiated transformation of ${contactResponses.length} contacts.`);

    const contacts: Contact[] = await Promise.all(
        contactResponses.map((contactResponse) => ContactResponseTransformer.transformResponse(contactResponse, contactService))
    );
    functions.logger.debug(`Completed transformation of ${contactResponses.length} contacts.`);

    return contacts;
  }

  private static async transformResponse(contactResponse: ContactResponse, contactService: ContactService): Promise<Contact> {
    const activities = await contactService.getContactActivities(contactResponse.ID);
    const needNtModifiedDate = ContactResponseTransformer.getNeedNtModifiedDate(activities);
    return {
      id: contactResponse.ID,
      name: contactResponse.post_title,
      address: contactResponse.contact_address.length > 0 ? contactResponse.contact_address[0].value : "",
      phone: contactResponse.contact_phone.length > 0 ? contactResponse.contact_phone[0].value : "",
      dateRequested: needNtModifiedDate !== undefined ? dayjs.unix(needNtModifiedDate).toString() : undefined,
    };
  }

  private static getNeedNtModifiedDate(activities: ActivityResponse[]): number | undefined {
    const needNtActivity = activities
        .filter((activity) => activity.meta_key === "nt_postman_keyselect" &&
            activity.object_note.includes("Needs NT Posted"));

    if (needNtActivity.length === 0) {
      return undefined;
    }

    if (needNtActivity.length > 1) {
      const modifiedTimes = needNtActivity.map((activity) => parseInt(activity.hist_time));
      return Math.max(...modifiedTimes);
    }

    return parseInt(needNtActivity[0].hist_time);
  }
}
