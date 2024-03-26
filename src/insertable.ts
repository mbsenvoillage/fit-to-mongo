import { FieldsMapping } from "./types/conversionMap.types.js";
import { IResult } from "./types/result.types.js";

export function buildDocFromFieldsMapping(
  fieldMapping: FieldsMapping,
  messageTypeEntry: { [field: string]: any }
): IResult<Record<string, any>> {
  return { result: {} };
}
