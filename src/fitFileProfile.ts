import { handleError } from "./errors.js";
import { IResult } from "./types/result.types.js";

type FitProfile = Record<string, Record<string, string>>;

/**
 * Extracts all messagesKey and corresponding fields from Garmin sdk Fit Profile object.
 * The Profile object gives the shape of a decoded Fit file
 * @param {Record<any, any>} unformattedFitProfile - The raw Profile object, untyped.
 */
export function slimDownGarminSdkProfile(
  unformattedFitProfile: Record<any, any>
): IResult<FitProfile> {
  let res: IResult<FitProfile> = { result: {} };
  const p = {};

  try {
    const messages = unformattedFitProfile.messages;

    // messages contains numbered keys
    for (let key in messages) {
      // the messagesKey property is what we'll be looking for in the decoded fit file
      const messagesKey = messages[key].messagesKey;

      if (typeof messagesKey != "string") {
        throw new Error("messagesKey is not of type string");
      }

      p[messagesKey] = {};

      // the fields property contains the name and type of the fields included in the object
      // of name [messagesKey]
      const messagesKeyFields = messages[key].fields;

      if (
        typeof messagesKeyFields != "object" ||
        !("fields" in messages[key])
      ) {
        throw new Error("the property fields is not an object or is absent ");
      }

      for (let subkey in messages[key].fields) {
        if (
          !("name" in messages[key].fields[subkey]) ||
          typeof messages[key].fields[subkey].name != "string"
        ) {
          throw new Error(
            "Property name in fields object does not exist or is not a string"
          );
        }
        p[messagesKey][messages[key].fields[subkey].name] =
          messages[key].fields[subkey].type;
      }
    }
  } catch (e: any) {
    res.err = handleError(e, slimDownGarminSdkProfile);
    return res;
  }

  res.result = p;
  return res;
}
