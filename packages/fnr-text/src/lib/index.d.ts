import XRegeExp from 'xregexp/types';

export declare const findr: (params: FindrParams) => FindrReturn;

export interface FindrConfig {
  ctxLen?: number;
  filterCtxMatch?: (match: string) => string;
  filterCtxReplacement?: (replacement: string) => string;
  buildResultKey?: (index: number) => ResultKey;
  xregexp?: typeof XRegeExp;
  isRegex?: boolean;
  isCaseMatched?: boolean;
  isWordMatched?: boolean;
  isCasePreserved?: boolean;
}

export type ResultKey = string | number;

export type metadata = { [key: string]: unknown };

export type replacementCallback = (params: {
  index: number;
  match: string;
  groups: Array<string>;
  position: number;
  source: string;
  namedGroups: { [key: string]: unknown };
}) => string;

type resultsAll = 'all';

export interface FindrParams {
  source: string;
  target: string | RegExp;
  replacement?: string | replacementCallback;
  contextLength?: number;
  replacementKeys?: Array<ResultKey> | resultsAll;
  metadata?: metadata;
  config?: FindrConfig;
}

export interface Context {
  before: string;
  after: string;
}

export interface FindrResult {
  match: string;
  replacement: string;
  context: Context;
  extContext: Context;
  resultKey: ResultKey;
  metadata: metadata;
}

export type FindrReplaced = string;

export interface FindrReturn {
  replaced: FindrReplaced;
  results: FindrResult[];
}

export default findr;