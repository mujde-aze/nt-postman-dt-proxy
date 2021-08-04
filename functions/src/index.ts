import * as functions from "firebase-functions";

export const postmanDtProxy = functions.region("australia-southeast1")
    .https.onRequest((request, response) => {
      let responseMessage = "";
      switch (request.method) {
        case "GET":
          responseMessage = "Hey, I just received a GET!";
          break;
        case "POST":
          responseMessage = "Hey, I just got POST-ed";
          break;
        default:
          responseMessage = "Unrecognized";
          break;
      }
      //    functions.logger.info("Hello logs!", {structuredData: true});
      response.send(responseMessage);
    });
