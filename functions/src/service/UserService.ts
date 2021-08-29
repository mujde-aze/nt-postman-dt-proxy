import axios from "axios";
import * as functions from "firebase-functions";
import {UserResponse} from "../model/UserResponse";

export class UserService {
    private usersPath = "/wp-json/dt/v1/users/get_users";

    constructor(public readonly baseUrl: string,
                public readonly transferToken: string) {
    }

    async getDTUserByEmail(userEmail: string): Promise<UserResponse> {
      let response;
      try {
        response = await axios
            .get(`${this.baseUrl}${this.usersPath}?s=${userEmail}`,
                {
                  headers: {"Authorization": `Bearer ${this.transferToken}`},
                }
            );
      } catch (error) {
        throw new functions.https.HttpsError("internal",
            "Problem retrieving user",
            error);
      }

      if (response.data.length == 0 ) {
        throw new functions.https.HttpsError("not-found",
            `User matching ${userEmail} not found.`);
      }

      if (response.data.length > 1 ) {
        throw new functions.https.HttpsError("internal",
            `Multiple results returned for user matching ${userEmail}.`);
      }

      return response.data[0] as UserResponse;
    }
}
