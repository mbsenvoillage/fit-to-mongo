import { handleError } from "./errors.js";
import { transformedFitProfileStructure } from "./fitFileProfile.js";
import {
  FitConversionMap,
  fitConversionMapSchema,
} from "./types/conversionMap.types.js";
import { IResult } from "./types/result.types.js";

export function validateConversionMap(
  conversionMap: FitConversionMap
): IResult<boolean> {
  const { error } = fitConversionMapSchema.validate(conversionMap);

  if (error) {
    console.error(error);
    return {
      err: handleError(
        new Error(`Validation error: ${error.message}`),
        validateConversionMap
      ),
      result: false,
    };
  }

  const fitKeys = Object.keys(transformedFitProfileStructure);

  const conversionMapKeys = Object.keys(conversionMap);

  const unknownKeys = [];

  conversionMapKeys.forEach((key) => {
    if (!fitKeys.includes(key)) {
      unknownKeys.push(key);
    }
  });
  if (unknownKeys.length) {
    return {
      err: handleError(
        new Error(`Validation error: ${error.message}`),
        validateConversionMap
      ),
      result: false,
    };
  }

  return { result: true };
}
