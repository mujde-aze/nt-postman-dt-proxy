import * as axios from "axios";
import * as functions from "firebase-functions";
import {Contact} from "../model/Contact";
import {ContactResponse} from "../model/ContactResponse";
import {TransferTokenGenerator} from "../model/TransferTokenGenerator";
import {PostmanState} from "../model/PostmanState";

export class DTRequestService {
    private contactsPath = "/wp-json/dt-posts/v2/contacts/";

    constructor(public readonly baseUrl: string,
                public readonly tokenGenerator: TransferTokenGenerator) {
    }

    async getContactsByPostmanState(postmanState: PostmanState): Promise<Contact[]> {
      try {
        const response = await axios.default
            .get(`${this.baseUrl}${(this.contactsPath)}?nt_postman_keyselect[]=${postmanState}`,
                {
                  headers: {"Authorization": `Bearer ${this.tokenGenerator.getTransferToken()}`},
                }
            );

        if (response.data.posts.length == 0) {
          return [];
        }

        return response.data.posts
            .map((contactResponse: ContactResponse) => this.transformResponse(contactResponse));
      } catch (error) {
        throw new functions.https.HttpsError("internal",
            "Problem retrieving contacts",
            error);
      }
    }

    async updateContactsPostmanState(postmanState: PostmanState, userId: number): Promise<void> {
      try {
        await axios.default
            .post(`${this.baseUrl}${this.contactsPath}${userId}`,
                {
                  "nt_postman_keyselect": postmanState,
                },
                {
                  headers: {"Authorization": `Bearer ${this.tokenGenerator.getTransferToken()}`},
                }
            );
      } catch (error) {
        throw new functions.https.HttpsError("internal",
            `Problem updating contact with ${postmanState} for user ${userId}`,
            error);
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
