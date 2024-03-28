import { expect, describe, it } from "vitest";
import { embedDocument, mapFitFields } from "./insertable.js";

describe("mapFitFields", () => {
  it("should build an insertable document if valid params are passed", () => {
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

    const { result, err } = mapFitFields(fieldsMapping, messagetypeEntry);

    expect(result).toEqual(expectedResult);
    expect(err).toBeUndefined();
  });

  it("should return an empty result and an error if invalid params are passed", () => {
    const { result, err } = mapFitFields(3 as any, undefined);

    expect(err).toBeDefined();
    expect(result).toEqual({});
  });
});

describe("embedDocument", () => {
  it("should build an insertable document if valid params are passed", () => {
    const config = {
      messageType: "activityMesgs",
      embedAs: "msgs",
      fieldMappings: {
        numSessions: "n",
        eventType: "s",
      },
    };

    const decodedFitFile = {
      activityMesgs: [
        {
          timestamp: "2024-02-29T16:03:53.000Z",
          localTimestamp: 1078160633,
          numSessions: 1,
          type: "manual",
          event: "activity",
          eventType: "stop",
          totalTimerTime: 2043,
        },
      ],
    };

    const expectedResult = {
      msgs: [
        {
          n: 1,
          s: "stop",
        },
      ],
    };

    const { result, err } = embedDocument(config, decodedFitFile);

    console.log(JSON.stringify(result));

    expect(result).toEqual(expectedResult);
  });
});
