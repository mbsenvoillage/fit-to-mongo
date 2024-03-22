import { Err } from "./types/error.types.js";

export function isError(e: any) {
  return e && e.stack && e.message;
}

export function handleError(
  e: any,
  caller: (...args: unknown[]) => unknown
): Err {
  return {
    msg: isError(e)
      ? `${caller.name}: ${e.message}`
      : `Unknown error in ${caller.name}`,
    e,
  };
}
