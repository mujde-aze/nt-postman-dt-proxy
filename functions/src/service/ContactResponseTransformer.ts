import {ActivityResponse} from "../model/ActivityResponse";
import * as dayjs from "dayjs";
import {ContactResponse} from "../model/ContactResponse";
import {Contact} from "../model/Contact";
import {ContactService} from "./ContactService";

export class ContactResponseTransformer {
  static async transformResponses(contactResponses: ContactResponse[], contactService: ContactService): Promise<Contact[]> {
    const contacts: Contact[] = [];
    for (const contactResponse of contactResponses) {
      const activities = await contactService.getContactActivities(contactResponse.ID);
      contacts.push(ContactResponseTransformer.transformResponse(contactResponse, activities));
    }

    return contacts;
  }

  static transformResponse(contactResponse: ContactResponse, activities: ActivityResponse[]): Contact {
    const needNtModifiedDate = ContactResponseTransformer.getNeedNtModifiedDate(activities);
    return {
      id: contactResponse.ID,
      name: contactResponse.post_title,
      address: contactResponse.contact_address[0].value,
      phone: contactResponse.contact_phone[0].value,
      dateRequested: needNtModifiedDate,
    };
  }

  private static getNeedNtModifiedDate(activities: ActivityResponse[]): string | undefined {
    const needNtActivity = activities
        .filter((activity) => activity.meta_key === "nt_postman_keyselect" &&
            activity.object_note.includes("Needs NT Posted"));

    if (needNtActivity.length === 0) {
      return undefined;
    }

    if (needNtActivity.length > 1) {
      const modifiedTimes = needNtActivity.map((activity) => parseInt(activity.hist_time));
      const mostRecentModification = Math.max(...modifiedTimes);
      return dayjs.unix(mostRecentModification).toString();
    }

    const modifiedTime = parseInt(needNtActivity[0].hist_time);
    return dayjs.unix(modifiedTime).toString();
  }
}
