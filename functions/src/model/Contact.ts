import {ContactAddress} from "./ContactAddress";

export interface Contact {
    id: string;
    name: string;
    contactAddresses: ContactAddress[];
}
