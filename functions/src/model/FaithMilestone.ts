import * as functions from "firebase-functions";

export enum FaithMilestone {
    BAPTIZED = "milestone_baptized",
    CAN_SHARE = "milestone_can_share",
    SHARING = "milestone_sharing",
    HAS_BIBLE = "milestone_has_bible",
    READING_BIBLE = "milestone_reading_bible",
    IN_GROUP = "milestone_in_group",
    BAPTIZING = "milestone_baptizing",
    PLANTING = "milestone_planting",
    BELIEF = "milestone_belief",
}

export function resolveMilestoneByValue(value: string): FaithMilestone {
  switch (value) {
    case "milestone_baptized":
      return FaithMilestone.BAPTIZED;
    case "milestone_can_share":
      return FaithMilestone.CAN_SHARE;
    case "milestone_sharing":
      return FaithMilestone.SHARING;
    case "milestone_has_bible":
      return FaithMilestone.HAS_BIBLE;
    case "milestone_reading_bible":
      return FaithMilestone.READING_BIBLE;
    case "milestone_in_group":
      return FaithMilestone.IN_GROUP;
    case "milestone_baptizing":
      return FaithMilestone.BAPTIZING;
    case "milestone_planting":
      return FaithMilestone.PLANTING;
    case "milestone_belief":
      return FaithMilestone.BELIEF;
    default:
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Faith milestone not recognized."
      );
  }
}
