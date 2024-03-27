import { handleError } from "./errors.js";
import { FieldsMapping } from "./types/conversionMap.types.js";
import { IResult } from "./types/result.types.js";

export function buildDocFromFieldsMapping(
  fieldMapping: FieldsMapping,
  fitFileMessageTypeElement: { [field: string]: any }
): IResult<Record<string, any>> {
  let result = {};

  try {
    if (
      typeof fieldMapping != "object" ||
      typeof fitFileMessageTypeElement != "object"
    ) {
      return {
        err: handleError(
          new Error(`Params should be objects only`),
          buildDocFromFieldsMapping
        ),
        result: {},
      };
    }
    for (let fitKey in fieldMapping) {
      result[fieldMapping[fitKey]] = fitFileMessageTypeElement[fitKey];
    }
  } catch (e) {
    return {
      err: handleError(e, buildDocFromFieldsMapping),
      result: {},
    };
  }

  return { result };
}
