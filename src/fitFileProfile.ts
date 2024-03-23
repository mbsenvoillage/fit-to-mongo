import Joi from "joi";
import { handleError } from "./errors.js";
import { IResult } from "./types/result.types.js";
import { Profile } from "@garmin/fitsdk";

type FitProfile = Record<string, Record<string, string>>;

// Schema for each field within a message
const fieldSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
}).unknown(true);

const fieldsSchema = Joi.object().pattern(Joi.number(), fieldSchema);

// Schema for each message within the profile
const messageSchema = Joi.object({
  messagesKey: Joi.string().required(),
  fields: fieldsSchema,
}).unknown(true);

// Schema for the messages object within the profile, which uses numeric keys
const messagesSchema = Joi.object().pattern(Joi.number(), messageSchema);

// Schema for the entire profile object
const profileSchema = Joi.object({
  messages: messagesSchema,
}).unknown(true);

/**
 * Transforms the Garmin SDK's Fit Profile object into a simplified structure.
 * This function iterates over the `messages` object of the Fit Profile, extracting
 * each message's key and its fields, including the field names and types. The result
 * is a more manageable object mapping each messageKey to its corresponding fields
 * and types, facilitating easier access and manipulation of Fit Profile data.
 *
 * @param {Record<string, any>} unformattedFitProfile - The raw, complex Fit Profile object
 *        provided by the Garmin SDK. This object includes detailed information about
 *        each message and field in a decoded FIT file.
 * @returns {IResult<FitProfile>} An object encapsulating the transformed Fit Profile data.
 *          If successful, the `result` property contains the simplified Fit Profile structure.
 *          In case of an error during transformation, the `err` property captures the error
 *          details, while `result` will be an empty object.
 */
export function transformFitProfileStructure(
  unformattedFitProfile: any
): IResult<FitProfile> {
  let res: IResult<FitProfile> = { result: {} };

  // Validate the entire structure upfront
  const { error } = profileSchema.validate(unformattedFitProfile, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (error) {
    return {
      err: handleError(
        new Error(`Validation error: ${error.message}`),
        transformFitProfileStructure
      ),
      result: {},
    };
  }

  try {
    const messages = unformattedFitProfile.messages;

    for (let key in messages) {
      const message = messages[key];
      const messagesKey = message.messagesKey;
      res.result[messagesKey] = {};

      for (let fieldKey in message.fields) {
        const field = message.fields[fieldKey];
        res.result[messagesKey][field.name] = field.type;
      }
    }
  } catch (e: any) {
    // Catch any unexpected errors during transformation
    res.err = handleError(e, transformFitProfileStructure);
    return res;
  }

  return res;
}

export const { result: transformedFitProfileStructure } =
  transformFitProfileStructure(Profile);
