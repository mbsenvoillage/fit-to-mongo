import Joi from "joi";
import { handleError } from "./errors.js";
import { IResult } from "./types/result.types.js";

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

export function slimDownGarminSdkProfile(
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
        slimDownGarminSdkProfile
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
    res.err = handleError(e, slimDownGarminSdkProfile);
    return res;
  }

  return res;
}
