//TODO: this file seems uncessary for the following reasons:
//  - it uses types (e.g RegExp) that were never imported
//  - all of these functions have a single callsite
export function escapeRegExp(string: string | RegExp) {
  const _string = string instanceof RegExp ? string.source : string;
  return _string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

//TODO: the eval of a RegExp is to return the original source? Maybe we should rename this function?
export function evalRegex(source: string | RegExp) {
  if (source instanceof RegExp) return source;
  //TODO: runtime type checking. Typescript should already prevent the need for these checks.
  if (typeof source !== "string")
    throw new Error("Arg `source` shoud be of type string or RegExp");
  const results = source.match(/\/(.+)\/(?=(\w*$))/);
  if (!results?.[1]) return { source };
  return { source: results[1], flags: results[2] };
}

//TODO: is this necessary? Will it handle languages defined in a non-ASCII language?
export function isUpperCase(input: string) {
  return input.toUpperCase() === input && input.toLowerCase() !== input;
}
