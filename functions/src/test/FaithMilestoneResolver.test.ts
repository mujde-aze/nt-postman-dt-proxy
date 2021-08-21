import {HttpsError} from "firebase-functions/lib/providers/https";
import {FaithMilestone, resolveMilestoneByValue} from "../model/FaithMilestone";

describe("The faith milestone resolver", () => {
  it("Should return BAPTIZED if the value is milestone_baptized", () => {
    expect(resolveMilestoneByValue("milestone_baptized")).toBe(FaithMilestone.BAPTIZED);
  });
  it("Should return CAN_SHARE if the value is milestone_can_share", () => {
    expect(resolveMilestoneByValue("milestone_can_share")).toBe(FaithMilestone.CAN_SHARE);
  });
  it("Should return SHARING if the value is milestone_sharing", () => {
    expect(resolveMilestoneByValue("milestone_sharing")).toBe(FaithMilestone.SHARING);
  });
  it("Should return HAS_BIBLE if the value is milestone_has_bible", () => {
    expect(resolveMilestoneByValue("milestone_has_bible")).toBe(FaithMilestone.HAS_BIBLE);
  });
  it("Should return READING_BIBLE if the value is milestone_reading_bible", () => {
    expect(resolveMilestoneByValue("milestone_reading_bible")).toBe(FaithMilestone.READING_BIBLE);
  });
  it("Should return IN_GROUP if the value is milestone_in_group", () => {
    expect(resolveMilestoneByValue("milestone_in_group")).toBe(FaithMilestone.IN_GROUP);
  });
  it("Should return BAPTIZING if the value is milestone_baptizing", () => {
    expect(resolveMilestoneByValue("milestone_baptizing")).toBe(FaithMilestone.BAPTIZING);
  });
  it("Should return PLANTING if the value is milestone_planting", () => {
    expect(resolveMilestoneByValue("milestone_planting")).toBe(FaithMilestone.PLANTING);
  });
  it("Should return BELIEF if the value is milestone_belief", () => {
    expect(resolveMilestoneByValue("milestone_belief")).toBe(FaithMilestone.BELIEF);
  });
  it("Should throw an HttpsError for any other value", () => {
    expect(() => {
      resolveMilestoneByValue("some_garbage");
    }).toThrowError(HttpsError);
  });
});
