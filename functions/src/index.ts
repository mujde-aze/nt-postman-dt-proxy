import * as functions from "firebase-functions";
import {ProxyResponse} from "./models/ProxyResponse";

export const postmanDtProxy = functions.region("australia-southeast1")
    .https.onRequest((request, response) => {
      const proxyResponse: ProxyResponse = {
        message: "Unrecognized",
        statusCode: 400,
      };

      switch (request.method) {
        case "GET":
          proxyResponse.message = "Hey, I just received a GET!";
          proxyResponse.statusCode = 200;
          break;
        case "PUT":
          proxyResponse.message = "Hey, I just got PUT-ed";
          proxyResponse.statusCode = 200;
          break;
        default:
          break;
      }
      //    functions.logger.info("Hello logs!", {structuredData: true});
      response.status(proxyResponse.statusCode).json(proxyResponse);
    });
