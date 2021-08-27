import {ActivityResponse} from "../model/ActivityResponse";
import {ContactResponseTransformer} from "../service/ContactResponseTransformer";
import {ContactResponse} from "../model/ContactResponse";

describe("The transformResponse method", ()=>{
  const contactResponse: ContactResponse = {
    ID: "my-id",
    post_title: "Bob Marley",
    contact_address: [{value: "Kingston, Jamaica", verified: true}],
    contact_phone: [{value: "555-12345", verified: true}],
  };

  it("Should return undefined for the dateRequested property if there is no 'need_nt' activity", () => {
    const activities: ActivityResponse[] = [
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: NT Posted", hist_time: "1629795230"},
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: NT Posted", hist_time: "1629685230"},
    ];
    const contact = ContactResponseTransformer.transformResponse(contactResponse, activities);
    expect(contact.id).toBe("my-id");
    expect(contact.name).toBe("Bob Marley");
    expect(contact.phone).toBe("555-12345");
    expect(contact.address).toBe("Kingston, Jamaica");
    expect(contact.dateRequested).toBeUndefined();
  });

  it("Should return 'Tue, 06 Jul 2021 15:27:10 GMT' if there is one matching activity", () => {
    const activities: ActivityResponse[] = [
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: Needs NT Posted", hist_time: "1625585230"},
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: NT Posted", hist_time: "1629685230"},
      {meta_key: "milestones", object_note: "Has Bible removed from Faith Milestones", hist_time: "1629795230"},
    ];
    const contact = ContactResponseTransformer.transformResponse(contactResponse, activities);
    expect(contact.id).toBe("my-id");
    expect(contact.name).toBe("Bob Marley");
    expect(contact.phone).toBe("555-12345");
    expect(contact.address).toBe("Kingston, Jamaica");
    expect(contact.dateRequested).toBe("Tue, 06 Jul 2021 15:27:10 GMT");
  });

  it("Should return the max updated date if more than one matching activity exists", () => {
    const activities: ActivityResponse[] = [
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: Needs NT Posted", hist_time: "1629795230"},
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: Needs NT Posted", hist_time: "1625585230"},
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: NT Posted", hist_time: "1629685230"},
    ];
    const contact = ContactResponseTransformer.transformResponse(contactResponse, activities);
    expect(contact.id).toBe("my-id");
    expect(contact.name).toBe("Bob Marley");
    expect(contact.phone).toBe("555-12345");
    expect(contact.address).toBe("Kingston, Jamaica");
    expect(contact.dateRequested).toBe("Tue, 24 Aug 2021 08:53:50 GMT");
  });
});
