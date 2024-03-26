import { expect, describe, it } from "vitest";
import { buildDocFromFieldsMapping } from "./insertable.js";

describe("buildDocFromFieldsMapping", () => {
  it("should build", () => {
    const messagetypeEntry = {
      timestamp: "2024-02-29T15:29:52.000Z",
      positionLat: 520602642,
      positionLong: 85092928,
      gpsAccuracy: 7,
      altitude: 4.199999999999989,
      grade: 0,
      distance: 7.32,
      calories: 0,
      cadence: 67,
      speed: 4.507,
      power: 73,
      leftPedalSmoothness: 19,
      leftTorqueEffectiveness: 67,
      enhancedAltitude: 4.199999999999989,
      enhancedSpeed: 4.507,
      developerFields: { "7": 0, "13": 0 },
    };

    const fieldsMapping = {
      positionLat: "latitude",
      positionLong: "longitude",
      power: "power",
    };

    const expectedResult = {
      latitude: 520602642,
      longitude: 85092928,
      power: 73,
    };

    const { result, err } = buildDocFromFieldsMapping(
      fieldsMapping,
      messagetypeEntry
    );

    expect(result).toEqual(expectedResult);
  });
});
