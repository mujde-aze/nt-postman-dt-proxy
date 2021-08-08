import * as axios from "axios";
import * as functions from "firebase-functions";
import {Contact} from "../model/Contact";
import {ContactResponse} from "../model/ContactResponse";
import {PostmanState} from "../model/PostmanState";

export class ContactService {
    private contactsPath = "/wp-json/dt-posts/v2/contacts/";

    constructor(public readonly baseUrl: string,
                public readonly transferToken: string) {
    }

    async getContactsByPostmanState(postmanState: PostmanState, assignedTo?: string): Promise<Contact[]> {
      let response: axios.AxiosResponse;

      try {
        response = await axios.default
            .get(this.getRequestPath(postmanState, assignedTo),
                {
                  headers: {"Authorization": `Bearer ${this.transferToken}`},
                }
            );
      } catch (error) {
        throw new functions.https.HttpsError("internal",
            "Problem retrieving contacts",
            error);
      }

      if (response.data.posts.length == 0) {
        throw new functions.https.HttpsError("not-found",
            `No contacts in the state ${postmanState}`);
      }

      return response.data.posts
          .map((contactResponse: ContactResponse) => this.transformResponse(contactResponse));
    }

    async updateContactsPostmanState(postmanState: PostmanState, userId: number): Promise<void> {
      try {
        await axios.default
            .post(`${this.baseUrl}${this.contactsPath}${userId}`,
                {
                  "nt_postman_keyselect": postmanState,
                },
                {
                  headers: {"Authorization": `Bearer ${this.transferToken}`},
                }
            );
      } catch (error) {
        throw new functions.https.HttpsError("internal",
            `Problem updating contact with ${postmanState} for user ${userId}`,
            error);
      }
    }

    private getRequestPath(postmanState: PostmanState, assignedTo?: string): string {
      if (assignedTo) {
        return `${this.baseUrl}${(this.contactsPath)}?nt_postman_keyselect[]=${postmanState}&assigned_to[]=${assignedTo}`;
      } else {
        return `${this.baseUrl}${(this.contactsPath)}?nt_postman_keyselect[]=${postmanState}`;
      }
    }

    private transformResponse(contactResponse: ContactResponse): Contact {
      return {
        id: contactResponse.ID,
        name: contactResponse.post_title,
        contactAddresses: contactResponse.contact_address,
      };
    }
}
