import { Err } from "./error.types.js";

export interface IResult<T> {
  result: T;
  err?: Err;
}
