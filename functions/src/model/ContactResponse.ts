export interface DTPostResponse {
    posts: ContactResponse[]
}

export interface ContactResponse {
    ID: string;
    // eslint-disable-next-line camelcase
    post_title: string;
    // eslint-disable-next-line camelcase
    contact_address: ContactAddress[];
    // eslint-disable-next-line camelcase
    contact_phone: ContactPhone[];
    last_modified: LastModified;
}

export interface ContactPhone {
    verified: boolean;
    value: string;
}

export interface ContactAddress {
    verified: boolean;
    value: string;
}

export interface LastModified {
    timestamp: number;
    formatted: string;
}
