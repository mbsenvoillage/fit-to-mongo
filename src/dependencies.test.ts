import { expect, describe, it } from "vitest";
import { buildDependencyGraph } from "./dependencies.js";

describe("buildDependencyGraph", () => {
  const depGraph = {
    activityRecords: ["activities", "efforts"],
    workoutdata: ["activities", "segments"],
  };
  const conversionMap = {
    recordMesgs: {
      collectionName: "activityRecords",
      fields: {
        positionLat: "latitude",
        positionLong: "longitude",
        heartRate: "heart_rate",
      },
      documentReferences: [
        {
          localField: "activityId",
          foreignCollection: "activities",
          foreignField: "_id",
        },
        {
          localField: "activityId",
          foreignCollection: "efforts",
          foreignField: "_id",
        },
      ],
      embeddedDocuments: [
        {
          messageType: "recordMesgs",
          embedAs: "embeddedFieldName1",
          fieldMappings: {
            positionLat: "mongoField1",
            positionLong: "mongoField2",
          },
        },
        {
          messageType: "recordMesgs",
          embedAs: "embeddedFieldName2",
          fieldMappings: {
            positionLong: "mongoFieldA",
            heartRate: "mongoFieldB",
          },
        },
      ],
    },
    activityMesgs: {
      collectionName: "workoutdata",
      fields: {
        positionLat: "latitude",
        positionLong: "longitude",
        heartRate: "heart_rate",
      },
      documentReferences: [
        {
          localField: "activityId",
          foreignCollection: "activities",
          foreignField: "_id",
        },
        {
          localField: "activityId",
          foreignCollection: "segments",
          foreignField: "_id",
        },
      ],
      embeddedDocuments: [
        {
          messageType: "recordMesgs",
          embedAs: "embeddedFieldName1",
          fieldMappings: {
            positionLat: "mongoField1",
            positionLong: "mongoField2",
          },
        },
        {
          messageType: "recordMesgs",
          embedAs: "embeddedFieldName2",
          fieldMappings: {
            positionLong: "mongoFieldA",
            heartRate: "mongoFieldB",
          },
        },
      ],
    },
  };

  it("should return a dependency graph ", () => {
    const { result, err } = buildDependencyGraph(conversionMap);

    expect(result).toEqual(depGraph);
  });
});
