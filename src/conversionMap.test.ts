import { validateConversionMap } from "./conversionMap.js";

describe("validateConversionMap", () => {
  const conversionMapWithErroneousFields = {
    recordMsgs: {
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
      ],
      embeddedDocuments: [
        {
          messageType: "messageType1",
          embedAs: "embeddedFieldName1",
          fieldMappings: {
            fitField1: "mongoField1",
            fitField2: "mongoField2",
          },
        },
        {
          messageType: "messageType2",
          embedAs: "embeddedFieldName2",
          fieldMappings: {
            fitFieldA: "mongoFieldA",
            fitFieldB: "mongoFieldB",
          },
        },
      ],
    },
  };

  it("MAIN: should return true if the passed conversion map has the right format", () => {
    const { result } = validateConversionMap(conversionMapWithErroneousFields);

    expect(result).toBe(true);
  });
});
