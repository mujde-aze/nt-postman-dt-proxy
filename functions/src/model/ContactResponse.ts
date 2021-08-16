export interface ContactResponse {
    ID: string;
    // eslint-disable-next-line camelcase
    post_title: string;
    // eslint-disable-next-line camelcase
    contact_address: ContactAddress[];
    // eslint-disable-next-line camelcase
    contact_phone: ContactPhone[];
}

export interface ContactPhone {
    verified: boolean;
    value: string;
}

export interface ContactAddress {
    verified: boolean;
    value: string;
}
