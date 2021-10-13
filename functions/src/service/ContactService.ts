import axios from "axios";
import * as functions from "firebase-functions";
import {ContactResponse, DTPostResponse} from "../model/ContactResponse";
import {PostmanState} from "../model/PostmanState";
import {FaithMilestone} from "../model/FaithMilestone";
import {ActivityResponse, DTActivityResponse} from "../model/ActivityResponse";

export class ContactService {
  private contactsPath = "/wp-json/dt-posts/v2/contacts/";

  constructor(public readonly baseUrl: string,
                public readonly transferToken: string) {
  }

  async getContactsByPostmanState(postmanState: PostmanState, assignedTo?: string): Promise<ContactResponse[]> {
    let response;

    try {
      response = await axios
          .get<DTPostResponse>(this.getRequestPath(postmanState, assignedTo),
              {
                headers: {"Authorization": `Bearer ${this.transferToken}`},
              }
          );
    } catch (error) {
      throw new functions.https.HttpsError("internal",
          "Problem retrieving contacts",
          error);
    }

    const contactResponses = response.data.posts;

    if (contactResponses.length == 0) {
      throw new functions.https.HttpsError("not-found",
          `No contacts in the state ${postmanState}`);
    }
    functions.logger.debug(`Retrieved a total of ${contactResponses.length} contacts in getContactsByPostmanState for the state ${postmanState}.`);

    return contactResponses;
  }

  async updateContactsPostmanState(postmanState: PostmanState, userId: number): Promise<void> {
    try {
      await axios
          .post(`${this.baseUrl}${this.contactsPath}${userId}`,
              {
                "nt_postman_keyselect": postmanState,
              },
              {
                headers: {"Authorization": `Bearer ${this.transferToken}`},
              }
          );
    } catch (error) {
      throw new functions.https.HttpsError("internal",
          `Problem updating contact with ${postmanState} for user ${userId}`,
          error);
    }

    functions.logger.debug(`Finished updating postman state of user ${userId} in updateContactsPostmanState.`);
  }

  async updateContactsFaithMilestone(faithMileStone: FaithMilestone, userId: number): Promise<void> {
    try {
      await axios
          .post(`${this.baseUrl}${this.contactsPath}${userId}`,
              {
                "milestones":
                            {
                              "values": [
                                {"value": faithMileStone},
                              ],
                            },
              }, {
                headers: {"Authorization": `Bearer ${this.transferToken}`},
              }
          );
    } catch (error) {
      throw new functions.https.HttpsError("internal",
          `Problem updating contact with ${faithMileStone} for user ${userId}`,
          error);
    }
  }

  async getContactActivities(userId: string): Promise<ActivityResponse[]> {
    try {
      const {data} = await axios
          .get<DTActivityResponse>(`${this.baseUrl}${this.contactsPath}${userId}/activity`,
              {
                headers: {"Authorization": `Bearer ${this.transferToken}`},
              });

      const activityResponse = data.activity;
      functions.logger.debug(`Retrieved a total of ${activityResponse.length} activities in getContactActivities for user ${userId}.`);

      return activityResponse;
    } catch (error) {
      throw new functions.https.HttpsError("internal",
          "Problem retrieving contact activity",
          error);
    }
  }

  private getRequestPath(postmanState: PostmanState, assignedTo?: string): string {
    if (assignedTo) {
      return `${this.baseUrl}${(this.contactsPath)}?nt_postman_keyselect[]=${postmanState}&assigned_to[]=${assignedTo}`;
    } else {
      return `${this.baseUrl}${(this.contactsPath)}?nt_postman_keyselect[]=${postmanState}`;
    }
  }
}
