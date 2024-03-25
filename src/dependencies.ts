import { FitConversionMap } from "./types/conversionMap.types.js";
import { IResult } from "./types/result.types.js";

interface DependencyGraph {
  [key: string]: Array<string>;
}

export function buildDependencyGraph(
  conversionMap: FitConversionMap
): IResult<DependencyGraph> {
  const dependencyGraph: DependencyGraph = {};

  for (let msgType in conversionMap) {
    const collName = conversionMap[msgType].collectionName;
    const docRefs = conversionMap[msgType].documentReferences;

    for (let doc of docRefs) {
      if (collName in dependencyGraph) {
        dependencyGraph[collName].push(doc.foreignCollection);
      } else {
        dependencyGraph[collName] = [doc.foreignCollection];
      }
    }
  }

  return { result: dependencyGraph };
}
