import * as dayjs from "dayjs";
import {ContactResponse} from "../model/ContactResponse";
import {Contact} from "../model/Contact";
import * as functions from "firebase-functions";

export class ContactResponseTransformer {
  static transformResponses(contactResponses: ContactResponse[]): Contact[] {
    functions.logger.debug(`Initiated transformation of ${contactResponses.length} contacts.`);

    const contacts: Contact[] = [];
    for (const contactResponse of contactResponses) {
      const transformedContact = ContactResponseTransformer.transformResponse(contactResponse);
      contacts.push(transformedContact);
    }

    functions.logger.debug(`Completed transformation of ${contactResponses.length} contacts.`);

    return contacts;
  }

  private static transformResponse(contactResponse: ContactResponse): Contact {
    return {
      id: contactResponse.ID,
      name: contactResponse.post_title,
      address: contactResponse.contact_address?.length > 0 ? contactResponse.contact_address[0].value : "",
      phone: contactResponse.contact_phone?.length > 0 ? contactResponse.contact_phone[0].value : "",
      contactUpdated: dayjs.unix(contactResponse.last_modified.timestamp).toString(),
    };
  }
}
