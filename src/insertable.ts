import { handleError } from "./errors.js";
import {
  DocumentReference,
  EmbeddedDocumentConfig,
  FieldsMapping,
} from "./types/conversionMap.types.js";
import { IResult } from "./types/result.types.js";
import { ObjectId } from "mongodb";

export function mapFitFields(
  fieldMapping: FieldsMapping,
  fitFileMessageTypeElement: { [field: string]: any }
): IResult<Record<string, any>> {
  let result = {};

  try {
    if (
      typeof fieldMapping != "object" ||
      typeof fitFileMessageTypeElement != "object"
    ) {
      throw new Error(`Params should be objects only`);
    }
    for (let fitKey in fieldMapping) {
      result[fieldMapping[fitKey]] = fitFileMessageTypeElement[fitKey];
    }
  } catch (e) {
    return {
      err: handleError(e, mapFitFields),
      result: {},
    };
  }

  return { result };
}

export function embedDocument(
  embeddedDocConfig: EmbeddedDocumentConfig,
  decodedFitFile: { [field: string]: Array<Record<string, any>> }
): IResult<Record<string, any>> {
  let result = {};

  try {
    if (decodedFitFile[embeddedDocConfig.messageType].length > 10) {
      console.warn(
        "The messageType you want to embed contains more than 10 elements. Consider using a reference rather than an embedded document."
      );
    }

    for (let el of decodedFitFile[embeddedDocConfig.messageType]) {
      const { result: res } = mapFitFields(embeddedDocConfig.fieldMappings, el);

      embeddedDocConfig.embedAs in result
        ? result[embeddedDocConfig.embedAs].push(res)
        : (result[embeddedDocConfig.embedAs] = [res]);
    }
  } catch (e) {
    return {
      err: handleError(e, embedDocument),
      result: {},
    };
  }

  return { result };
}

export function referenceDocument(
  docReference?: DocumentReference,
  objectId?: ObjectId
) {}
