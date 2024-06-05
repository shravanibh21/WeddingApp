import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { MutableMap, makeSimpleMap } from "./map";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


// TODO: remove the dummy route
const guests: MutableMap = makeSimpleMap();

/** Handles request for /save by storing the given guest. */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.body.name);
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const content = req.body.content;
  if (content === undefined) {
    res.status(400).send('required argument "content" was missing');
    return;
  }

  res.send({saved: guests.setValue(name, content)});
}

/** Handles requests for /guests by returning a list of all guests */
export const values = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({values: guests.getValues()});
}

/** 
 * Used in tests to set the designs map back to empty. 
 * (exported ONLY for testing)
 */
export const resetGuestsForTesting = (): void => {
  // TODO(): implement this function
  guests.clearMap();
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
