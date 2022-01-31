import {ContactResponseTransformer} from "../service/ContactResponseTransformer";
import {ContactResponse} from "../model/ContactResponse";

jest.mock("axios");

describe("The transformResponses method", ()=>{
  const contactResponse: ContactResponse = {
    ID: "my-id",
    post_title: "Bob Marley",
    contact_address: [{value: "Kingston, Jamaica", verified: true}],
    contact_phone: [{value: "555-12345", verified: true}],
    last_modified: {timestamp: 1629795230, formatted: "blah"},
  };

  const contactResponseMissingPhone: ContactResponse = {
    ID: "my-id",
    post_title: "Bob Marley",
    contact_address: [{value: "Kingston, Jamaica", verified: true}],
    contact_phone: [],
    last_modified: {timestamp: 1629795230, formatted: "blah"},
  };

  it("Should return 'Tue, 06 Jul 2021 15:27:10 GMT' if there is one matching activity", () => {
    const contacts = ContactResponseTransformer.transformResponses([contactResponse]);

    expect(contacts[0].id).toBe("my-id");
    expect(contacts[0].name).toBe("Bob Marley");
    expect(contacts[0].phone).toBe("555-12345");
    expect(contacts[0].address).toBe("Kingston, Jamaica");
    expect(contacts[0].contactUpdated).toBe("Tue, 24 Aug 2021 08:53:50 GMT");
  });

  it("Should return an empty field for phone if it is undefined", () => {
    const contacts = ContactResponseTransformer.transformResponses([contactResponseMissingPhone]);

    expect(contacts[0].id).toBe("my-id");
    expect(contacts[0].name).toBe("Bob Marley");
    expect(contacts[0].phone).toBe("");
    expect(contacts[0].address).toBe("Kingston, Jamaica");
    expect(contacts[0].contactUpdated).toBe("Tue, 24 Aug 2021 08:53:50 GMT");
  });
});
