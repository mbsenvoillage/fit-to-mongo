// profile.test.ts
import { transformFitProfileStructure } from "./fitFileProfile.js";

describe("transformFitProfileStructure", () => {
  it("MAIN: should extract keys and fields with types from Profile", () => {
    const profile = {
      messages: {
        0: {
          num: 0, // Must be first message in file.
          name: "fileId",
          messagesKey: "fileIdMesgs",
          fields: {
            0: {
              num: 0,
              name: "type",
              type: "file",
              array: "false",
              scale: 1,
              offset: 0,
              units: "",
              bits: [],
              components: [],
              isAccumulated: false,
              hasComponents: false,
              subFields: [],
            },
            1: {
              num: 1,
              name: "manufacturer",
              type: "manufacturer",
              array: "false",
              scale: 1,
              offset: 0,
              units: "",
              bits: [],
              components: [],
              isAccumulated: false,
              hasComponents: false,
              subFields: [],
            },
          },
        },
        49: {
          num: 49,
          name: "fileCreator",
          messagesKey: "fileCreatorMesgs",
          fields: {
            0: {
              num: 0,
              name: "softwareVersion",
              type: "uint16",
              array: "false",
              scale: 1,
              offset: 0,
              units: "",
              bits: [],
              components: [],
              isAccumulated: false,
              hasComponents: false,
              subFields: [],
            },
            1: {
              num: 1,
              name: "hardwareVersion",
              type: "uint8",
              array: "false",
              scale: 1,
              offset: 0,
              units: "",
              bits: [],
              components: [],
              isAccumulated: false,
              hasComponents: false,
              subFields: [],
            },
          },
        },
        162: {
          num: 162,
          name: "timestampCorrelation",
          messagesKey: "timestampCorrelationMesgs",
          fields: {
            253: {
              num: 253, // Whole second part of UTC timestamp at the time the system timestamp was recorded.
              name: "timestamp",
              type: "dateTime",
              array: "false",
              scale: 1,
              offset: 0,
              units: "s",
              bits: [],
              components: [],
              isAccumulated: false,
              hasComponents: false,
              subFields: [],
            },
            0: {
              num: 0, // Fractional part of the UTC timestamp at the time the system timestamp was recorded.
              name: "fractionalTimestamp",
              type: "uint16",
              array: "false",
              scale: 32768,
              offset: 0,
              units: "s",
              bits: [],
              components: [],
              isAccumulated: false,
              hasComponents: false,
              subFields: [],
            },
            1: {
              num: 1, // Whole second part of the system timestamp
              name: "systemTimestamp",
              type: "dateTime",
              array: "false",
              scale: 1,
              offset: 0,
              units: "s",
              bits: [],
              components: [],
              isAccumulated: false,
              hasComponents: false,
              subFields: [],
            },
          },
        },
      },
    };

    const expectedOutput = {
      fileIdMesgs: {
        type: "file",
        manufacturer: "manufacturer",
      },
      fileCreatorMesgs: {
        softwareVersion: "uint16",
        hardwareVersion: "uint8",
      },
      timestampCorrelationMesgs: {
        timestamp: "dateTime",
        fractionalTimestamp: "uint16",
        systemTimestamp: "dateTime",
      },
    };

    const { result } = transformFitProfileStructure(profile);
    expect(result).toEqual(expectedOutput);
  });

  it("MAIN: should return an empty result and an error if undefined is passed", () => {
    const { result, err } = transformFitProfileStructure(undefined);
    expect(result).toEqual({});
    expect(err).toBeDefined();
    console.error(err);
  });

  it("MAIN: should return an empty result and an error if input is not of the right format", () => {
    const { result, err } = transformFitProfileStructure({
      messages: {
        0: { messagesKey: 3, fields: { 0: { name: [], type: 2 } } },
      },
    });
    expect(result).toEqual({});
    expect(err).toBeDefined();
    console.error(err);
  });
  it("EDGE: should return an empty result and an error if input is a number", () => {
    const { result, err } = transformFitProfileStructure(2);
    expect(result).toEqual({});
    expect(err).toBeDefined();
    console.error(err);
  });
  it("EDGE: should return an empty result and an error if input is a string", () => {
    const { result, err } = transformFitProfileStructure("2");
    expect(result).toEqual({});
    expect(err).toBeDefined();
    console.error(err);
  });
});
