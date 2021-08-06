import * as axios from "axios";
import {Contact} from "../model/Contact";

export class DTRequestService {
    private contactsPath = "/wp-json/dt-posts/v2/contacts/";

    constructor(public readonly baseUrl: string) {
    }
    async getContactsByPostmanState(postmanState: string): Promise<Contact[]> {
      try {
        const response = await axios.default.get(`${this.baseUrl}${(this.contactsPath)}?nt_postman_keyselect[]=${postmanState}`);
        if (response.data.posts.length == 0) {
          return [];
        }
        // eslint-disable-next-line camelcase
        return response.data.posts.map((post: {ID: string, post_title: string, contact_address: {value: string}[]}) => {
          {
            id: post.ID,
            name: post.post_title,
            address: post.contact_address[0].value,
          }
        });
      } catch (error) {
        throw new Error(`Problem retrieving contacts. ${error.message}`);
      }
    }
}
