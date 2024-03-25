import { expect, describe, it } from "vitest";
import { buildDependencyGraph, detectCircularDep } from "./dependencies.js";

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

describe("detectCircularDep", () => {
  it("should detect a cycle in a graph with direct circular dependency", () => {
    const graph = {
      A: ["B"],
      B: ["A"], // Direct cycle with A
    };
    expect(detectCircularDep(graph)).toBe(true);
  });

  it("should detect a cycle in a graph with indirect circular dependency", () => {
    const graph = {
      A: ["B"],
      B: ["C"],
      C: ["A"], // Indirect cycle back to A
    };
    expect(detectCircularDep(graph)).toBe(true);
  });

  it("should not detect a cycle in a graph without circular dependencies", () => {
    const graph = {
      A: ["B"],
      B: ["C"],
      C: [], // No cycle
    };
    expect(detectCircularDep(graph)).toBe(false);
  });

  it("should handle graphs with multiple disconnected components", () => {
    const graph = {
      A: ["B"],
      B: ["C"],
      C: [], // No cycle here
      D: ["E"],
      E: ["D"], // Direct cycle with D
    };
    expect(detectCircularDep(graph)).toBe(true);
  });

  it("should return false for an empty graph", () => {
    const graph = {};
    expect(detectCircularDep(graph)).toBe(false);
  });
});
