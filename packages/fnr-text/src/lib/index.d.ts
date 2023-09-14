import XRegeExp from 'xregexp/types';

export declare const findr: (params: SearchAndReplace) => ReplacedAndResults;

export type Filter = (match: string) => string;

//TODO: is this really config? Config generally implies a consumer's app will set these values ONCE and use everywhere.
//for discoverability maybe we could rename this to SearchSettings?
//TODO: this type has all Maybe keys. do we need them?
//TODO: are all of these values being consumed in the core functionality?
export interface FindrConfig {
  ctxLen?: number;
  filterCtxMatch?: Filter;
  filterCtxReplacement?: Filter;
  buildResultKey?: (index: number) => ResultKey;
  //TODO: provide an explicitely defined type for XRegExp so users can more readly provide a value 
  //TODO: typo, should be XRegeExp
  xregexp?: typeof XRegeExp;
  isRegex?: boolean;
  isCaseMatched?: boolean;
  isWordMatched?: boolean;
  isCasePreserved?: boolean;
}


//TODO: make this well typed
// A brief look at the source code reveals it's type could be:
// {
//  source: typeof source,
//  match: typeof match,
//  searchIndex: typeof searchIndex,
//  position: typeof pos,
//  groups: typeof args,
//  namedGroups: typeof namedGroups,
//  ...metadata,
// }
export type Metadata = { [key: string]: unknown };

//TODO: extract the argument type (maybe create a more generic Callback type?)
//TODO: return type has `string` blindness.
export type ReplacementCallback = (params: {
  index: number;
  match: string;
  groups: Array<string>;
  //TODO: use a more refined type like a Natural. Things like negative numbers should be impossible to use here.
  position: number;
  source: string;
  namedGroups: { [key: string]: unknown };
}) => string;

export type ResultsAll = 'all';
export type ResultKey = string | number;

//TODO: avoid `string` type here. `string` implies ANY string. Does ANY string really work for these types?
//TODO: often when a variable is either a `string | a` then we are actually defining a more refined type `b` with 2
//constructors: `fromString : string -> b` and `fromA : a -> b`.
export interface SearchAndReplace {
  source: string;
  target: string | RegExp;
  replacement?: string | ReplacementCallback;
  contextLength?: number;
  replacementKeys?: Array<ResultKey> | ResultsAll;
  metadata?: Metadata;
  config?: FindrConfig;
}

//TODO: rename the Context to something that is more meaningful. Namely, what is this the "context" of?
export interface SurroundingContext {
  before: string;
  after: string;
}

export interface SearchResult {
  match: string;
  replacement: string;
  context: SurroundingContext;
  extContext: SurroundingContext;
  resultKey: ResultKey;
  metadata: Metadata;
}

export type ReplacedText = string;

export interface ReplacedAndResults {
  replaced: ReplacedText;
  results: SearchResult[];
}

export default findr;