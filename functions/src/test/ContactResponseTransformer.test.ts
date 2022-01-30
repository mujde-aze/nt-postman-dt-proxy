import {ActivityResponse} from "../model/ActivityResponse";
import {ContactResponseTransformer} from "../service/ContactResponseTransformer";
import {ContactResponse} from "../model/ContactResponse";
import {ContactService} from "../service/ContactService";
import axios from "axios";

jest.mock("axios");

describe("The transformResponses method", ()=>{
  let contactService: ContactService;
  let mockedAxios: jest.Mocked<import("axios").AxiosStatic>;

  beforeEach(() => {
    contactService = new ContactService("", "");
    mockedAxios = axios as jest.Mocked<typeof axios>;
  });

  const contactResponse: ContactResponse = {
    ID: "my-id",
    post_title: "Bob Marley",
    contact_address: [{value: "Kingston, Jamaica", verified: true}],
    contact_phone: [{value: "555-12345", verified: true}],
  };

  const contactResponseMissingPhone: ContactResponse = {
    ID: "my-id",
    post_title: "Bob Marley",
    contact_address: [{value: "Kingston, Jamaica", verified: true}],
    contact_phone: [],
  };

  it("Should return undefined for the dateRequested property if there is no 'need_nt' activity", async () => {
    const activities: ActivityResponse[] = [
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: NT Posted", hist_time: "1629795230"},
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: NT Posted", hist_time: "1629685230"},
    ];
    mockedAxios.get.mockResolvedValue({data: {activity: activities}});
    const contacts = await ContactResponseTransformer.transformResponses([contactResponse], contactService);

    expect(contacts[0].id).toBe("my-id");
    expect(contacts[0].name).toBe("Bob Marley");
    expect(contacts[0].phone).toBe("555-12345");
    expect(contacts[0].address).toBe("Kingston, Jamaica");
    expect(contacts[0].dateRequested).toBeUndefined();
  });

  it("Should return 'Tue, 06 Jul 2021 15:27:10 GMT' if there is one matching activity", async () => {
    const activities: ActivityResponse[] = [
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: Needs NT Posted", hist_time: "1625585230"},
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: NT Posted", hist_time: "1629685230"},
      {meta_key: "milestones", object_note: "Has Bible removed from Faith Milestones", hist_time: "1629795230"},
    ];
    mockedAxios.get.mockResolvedValue({data: {activity: activities}});
    const contacts = await ContactResponseTransformer.transformResponses([contactResponse], contactService);

    expect(contacts[0].id).toBe("my-id");
    expect(contacts[0].name).toBe("Bob Marley");
    expect(contacts[0].phone).toBe("555-12345");
    expect(contacts[0].address).toBe("Kingston, Jamaica");
    expect(contacts[0].dateRequested).toBe("Tue, 06 Jul 2021 15:27:10 GMT");
  });

  it("Should return the max updated date if more than one matching activity exists", async () => {
    const activities: ActivityResponse[] = [
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: Needs NT Posted", hist_time: "1629795230"},
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: Needs NT Posted", hist_time: "1625585230"},
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: NT Posted", hist_time: "1629685230"},
    ];

    mockedAxios.get.mockResolvedValue({data: {activity: activities}});
    const contacts = await ContactResponseTransformer.transformResponses([contactResponse], contactService);

    expect(contacts[0].id).toBe("my-id");
    expect(contacts[0].name).toBe("Bob Marley");
    expect(contacts[0].phone).toBe("555-12345");
    expect(contacts[0].address).toBe("Kingston, Jamaica");
    expect(contacts[0].dateRequested).toBe("Tue, 24 Aug 2021 08:53:50 GMT");
  });

  it("Should return an empty field for phone if it is undefined", async () => {
    const activities: ActivityResponse[] = [
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: NT Posted", hist_time: "1629795230"},
      {meta_key: "nt_postman_keyselect", object_note: "NT Postage Status: NT Posted", hist_time: "1629685230"},
    ];
    mockedAxios.get.mockResolvedValue({data: {activity: activities}});
    const contacts = await ContactResponseTransformer.transformResponses([contactResponseMissingPhone], contactService);

    expect(contacts[0].id).toBe("my-id");
    expect(contacts[0].name).toBe("Bob Marley");
    expect(contacts[0].phone).toBe("");
    expect(contacts[0].address).toBe("Kingston, Jamaica");
    expect(contacts[0].dateRequested).toBeUndefined();
  });
});
