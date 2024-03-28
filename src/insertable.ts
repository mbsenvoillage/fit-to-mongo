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

const t = {
  messageType: "messageType1",
  embedAs: "embeddedFieldName1",
  fieldMappings: {
    fitField1: "mongoField1",
    fitField2: "mongoField2",
  },
};

export function embedDocument(
  embeddedDocConfig: EmbeddedDocumentConfig,
  decodedFitFile: { [field: string]: Array<Record<string, any>> }
): IResult<Record<string, any>> {
  let result = {};

  for (let el of decodedFitFile[embeddedDocConfig.messageType]) {
    const { result: res } = mapFitFields(embeddedDocConfig.fieldMappings, el);

    embeddedDocConfig.embedAs in result
      ? result[embeddedDocConfig.embedAs].push(res)
      : (result[embeddedDocConfig.embedAs] = [res]);
  }
  return { result };
}

export function referenceDocument(
  docReference?: DocumentReference,
  objectId?: ObjectId
) {}
