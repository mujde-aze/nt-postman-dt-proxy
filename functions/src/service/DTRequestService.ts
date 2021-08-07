import * as axios from "axios";
import {Contact} from "../model/Contact";
import {ContactResponse} from "../model/ContactResponse";
import {TransferTokenGenerator} from "../model/TransferTokenGenerator";

export class DTRequestService {
    private contactsPath = "/wp-json/dt-posts/v2/contacts/";

    constructor(public readonly baseUrl: string,
                public readonly tokenGenerator: TransferTokenGenerator) {
    }

    async getContactsByPostmanState(postmanState: string): Promise<Contact[]> {
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
        // eslint-disable-next-line camelcase
        return response.data.posts
            .map((contactResponse: ContactResponse) => this.transformResponse(contactResponse));
      } catch (error) {
        throw new Error(`Problem retrieving contacts. ${error.message}`);
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
