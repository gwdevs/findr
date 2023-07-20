import XRegeExp from 'xregexp/types';

export declare const findr: (params: SearchAndReplace) => ReplacedAndResults;

export type Filter = (match: string) => string;

//TODO: is this really config? Config generally implies a consumer's app will set these values ONCE and use everywhere.
//for discoverability maybe we could rename this to SearchSettings?
export interface FindrConfig {
  ctxLen?: number;
  filterCtxMatch?: Filter;
  filterCtxReplacement?: Filter;
  buildResultKey?: (index: number) => ResultKey;
  xregexp?: typeof XRegeExp;
  isRegex?: boolean;
  isCaseMatched?: boolean;
  isWordMatched?: boolean;
  isCasePreserved?: boolean;
}


//TODO: make this well typed
// 
// {
//  source: source,
//  match: match,
//  searchIndex,
//  position: pos,
//  groups: args,
//  namedGroups,
//  ...metadata,
// }
export type Metadata = { [key: string]: unknown };

export type ReplacementCallback = (params: {
  index: number;
  match: string;
  groups: Array<string>;
  position: number;
  source: string;
  namedGroups: { [key: string]: unknown };
}) => string;

export type ResultsAll = 'all';
export type ResultKey = string | number;

export interface SearchAndReplace {
  source: string;
  target: string | RegExp;
  replacement?: string | ReplacementCallback;
  contextLength?: number;
  replacementKeys?: Array<ResultKey> | ResultsAll;
  metadata?: Metadata;
  config?: FindrConfig;
}

export interface Context {
  before: string;
  after: string;
}

export interface SearchResult {
  match: string;
  replacement: string;
  context: Context;
  extContext: Context;
  resultKey: ResultKey;
  metadata: Metadata;
}

export type ReplacedText = string;

export interface ReplacedAndResults {
  replaced: ReplacedText;
  results: SearchResult[];
}

export default findr;