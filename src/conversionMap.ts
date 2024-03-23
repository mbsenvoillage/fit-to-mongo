import { handleError } from "./errors.js";
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
