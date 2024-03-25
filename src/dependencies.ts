import { handleError } from "./errors.js";
import { FitConversionMap } from "./types/conversionMap.types.js";
import { IResult } from "./types/result.types.js";

interface DependencyGraph {
  [key: string]: Array<string>;
}

/**
 * Builds a dependency graph from a given conversion map. The graph represents
 * the relationships between collections as defined by document references
 * within the conversion map. Each collection is mapped to a list of collections
 * it depends on (foreign collections referenced by documents within the collection).
 * This function is useful for understanding and managing the dependencies between
 * different collections based on the configuration specified in the conversion map.
 *
 * @param {FitConversionMap} conversionMap - The conversion map containing configuration
 *        for message types, including the collection names and document references
 *        that define dependencies between collections.
 * @returns {IResult<DependencyGraph>} An object encapsulating the resulting dependency graph.
 *          The graph is a mapping from collection names to lists of foreign collection names
 *          they depend on, based on the document references specified in the conversion map.
 *          If successful, the `result` property contains the dependency graph.
 */
export function buildDependencyGraph(
  conversionMap: FitConversionMap
): IResult<DependencyGraph> {
  let res: IResult<DependencyGraph> = { result: {} };
  const dependencyGraph: DependencyGraph = {};

  try {
    for (let msgType in conversionMap) {
      const collName = conversionMap[msgType].collectionName;
      const docRefs = conversionMap[msgType].documentReferences;

      dependencyGraph[collName] = dependencyGraph[collName] || [];
      for (let doc of docRefs) {
        dependencyGraph[collName].push(doc.foreignCollection);
      }
    }
  } catch (e) {
    res.err = handleError(e, buildDependencyGraph);
    return res;
  }
  res.result = dependencyGraph;

  return res;
}
