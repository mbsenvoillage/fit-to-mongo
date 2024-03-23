import { handleError } from "./errors.js";
import { transformedFitProfileStructure } from "./fitFileProfile.js";
import {
  FitConversionMap,
  fitConversionMapSchema,
} from "./types/conversionMap.types.js";
import { IResult } from "./types/result.types.js";

function handleConversionMapError(error: unknown): IResult<boolean> {
  return {
    err: handleError(error, validateConversionMap),
    result: false,
  };
}

/**
 * Validates a conversion map against the transformed Fit profile structure. This function
 * ensures that all message types and fields specified in the conversion map are known
 * and defined within the transformed Fit profile structure.
 *
 * @param {FitConversionMap} conversionMap - The conversion map to be validated. This map
 *        contains configuration for how various message types and their fields should be
 *        transformed or mapped before being inserted into Mongo.
 * @param {Set<string>} [fitKeys=new Set(Object.keys(transformedFitProfileStructure))] - A set of known Fit
 *        message types derived from the transformed Fit profile structure.
 * @returns {IResult<boolean>} An object indicating the result of the validation. If the
 *          validation is successful, the result will be `true`. In case of validation failure,
 *          the `err` property will contain an error object describing the issue, and the
 *          `result` property will be `false`.
 */
export function validateConversionMap(
  conversionMap: FitConversionMap,
  fitKeys: Set<string> = new Set(Object.keys(transformedFitProfileStructure))
): IResult<boolean> {
  const { error } = fitConversionMapSchema.validate(conversionMap);

  if (error) {
    return handleConversionMapError(error);
  }

  const makeError = (msg: string) => handleConversionMapError(new Error(msg));
  for (let mapMessageType in conversionMap) {
    // check if mapMessageType is a known FIT messageType
    if (!fitKeys.has(mapMessageType)) {
      return makeError(
        `The conversionmap contains unknown fit messageType: ${mapMessageType}`
      );
    }

    // check if fields are known FIT fields
    for (let field in conversionMap[mapMessageType].fields) {
      if (!(field in transformedFitProfileStructure[mapMessageType])) {
        return makeError(
          `The conversionmap contains unknown fit field: ${field}`
        );
      }
    }

    // check if embedded doc messageType is a known FIT messageType
    for (let embeddedDocConfig of conversionMap[mapMessageType]
      .embeddedDocuments) {
      if (!fitKeys.has(embeddedDocConfig.messageType)) {
        return makeError(
          `The conversionmap contains unknown messageType in embeddedDocuments: ${embeddedDocConfig.messageType}`
        );
      }

      // check if embedded doc fields are known FIT fields
      for (let field in embeddedDocConfig.fieldMappings) {
        if (!(field in transformedFitProfileStructure[mapMessageType])) {
          return makeError(
            `The conversionmap contains unknown fit field in embeddedDocuments: ${field}`
          );
        }
      }
    }
  }

  return { result: true };
}
