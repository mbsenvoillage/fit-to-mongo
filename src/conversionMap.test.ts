import { validateConversionMap } from "./conversionMap.js";
import { expect, describe, it } from "vitest";

describe("validateConversionMap", () => {
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

  it("should return true if the passed conversion map has the right format", () => {
    const { result, err } = validateConversionMap(conversionMap);

    console.log(err);

    expect(result).toBe(true);
  });

  it("should return false if the passed conversion map has the wrong format", () => {
    const { result } = validateConversionMap({});

    expect(result).toBe(false);
  });

  it("should return true if the passed conversion map contains known messageTypes", () => {
    const { result } = validateConversionMap(conversionMap);

    expect(result).toBe(true);
  });

  it("should return false if the passed conversion map contains unknown messageTypes", () => {
    const { result, err } = validateConversionMap({
      recd: { collectionName: "hey", fields: {} },
    });

    console.log(err);
    expect(result).toBe(false);
  });

  it("should return false if the passed conversion map contains unknown fieldnames", () => {
    const erroneousFieldNames = {
      zerzer: "latitude",
      dfdf: "longitude",
      rér: "heart_rate",
    };

    const erroneousMap = { ...conversionMap };

    erroneousMap.recordMesgs.fields = erroneousFieldNames as any;
    const { result, err } = validateConversionMap(erroneousMap);

    console.log(err);
    expect(result).toBe(false);
  });

  it("should return false if the passed conversion map contains unknown messageTypes in embeddedDocuments", () => {
    const erroneousEmbeddedDocument = {
      ...conversionMap.recordMesgs.embeddedDocuments[0],
    };
    erroneousEmbeddedDocument.messageType = "eruzeriuy";

    const { result, err } = validateConversionMap({
      recordMesgs: {
        collectionName: "recordMesgs",
        fields: {},
        embeddedDocuments: [erroneousEmbeddedDocument],
      },
    });

    console.log(err);
    expect(result).toBe(false);
  });

  it("should return false if the passed conversion map contains unknown fields in embeddedDocuments", () => {
    const embeddedDocuments = [...conversionMap.recordMesgs.embeddedDocuments];

    embeddedDocuments[0].fieldMappings = { pistt: "eruherh" } as any;

    const { result, err } = validateConversionMap({
      recordMesgs: {
        collectionName: "recordMesgs",
        fields: {},
        embeddedDocuments,
      },
    });

    console.log(err);
    expect(result).toBe(false);
  });
});
