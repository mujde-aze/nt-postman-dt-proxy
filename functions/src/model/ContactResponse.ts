import {ContactAddress} from "./ContactAddress";

export interface ContactResponse {
    ID: string;
    // eslint-disable-next-line camelcase
    post_title: string;
    // eslint-disable-next-line camelcase
    contact_address: ContactAddress[];
}
