import Joi from "joi";

interface FieldsMapping {
  [fitFieldName: string]: string;
}

interface DocumentReference {
  localField: string; // Field in this document to match on
  foreignCollection: string; // The MongoDB collection to link to
  foreignField: string; // The field in the foreign document to match on
}

interface EmbeddedDocumentConfig {
  messageType: string; // Identifies the FIT message type to embed
  embedAs: string; // Property name under which the embedded document should appear
  fieldMappings: FieldsMapping; // Mappings from FIT fields to MongoDB document fields for the embedded document
}

export interface FitConversionMap {
  [messageType: string]: {
    collectionName: string;
    fields: FieldsMapping;
    documentReferences?: Array<DocumentReference>;
    embeddedDocuments?: Array<EmbeddedDocumentConfig>;
  };
}

const fieldsMappingSchema = Joi.object().pattern(Joi.string(), Joi.string());
const documentReferenceSchema = Joi.array().items({
  localField: Joi.string().required(),
  foreignCollection: Joi.string().required(),
  foreignField: Joi.string().required(),
});
const embeddedDocumentConfigSchema = Joi.array().items({
  messageType: Joi.string().required(),
  embedAs: Joi.string().required(),
  fieldMappings: fieldsMappingSchema,
});

export const fitConversionMapSchema = Joi.object().pattern(
  Joi.string(),
  Joi.object({
    collectionName: Joi.string(),
    fields: fieldsMappingSchema,
    documentReferences: documentReferenceSchema,
    embeddedDocuments: embeddedDocumentConfigSchema,
  })
);
