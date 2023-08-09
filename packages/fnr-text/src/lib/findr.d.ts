declare function findr<
  TExtendedResultData extends Record<string, unknown>
>(params: {
  source: string;
  target: string | RegExp;
  replacement?: ReplacementPattern | string | ReplacementCallback;
  replacementKeys?: Array<string | number> | 'all';
  options?: {
    isRegex?: boolean;
    isCaseMatched?: boolean;
    isWordMatched?: boolean;
    isCasePreserved?: boolean;
  };
  hooks?: {
    onSetResultKey?: (resultIndex: number) => number | string;
    onSetResultData?: (result: SearchResultData) => TExtendedResultData;
  };
  config?: {
    xregexp?: (pattern: string, flags?: string) => RegExp;
    patterns?: {
      wordLike?: string | RegExp;
      upperCase?: string | RegExp;
    };
  };
}): {
  replaced: string;
  results: (SearchResultData & TExtendedResultData)[];
};

interface MatchObject {
  index: PositiveInteger;
  match: FoundString;
  groups: FoundSubstring[];
  position: PositiveInteger;
  source: string;
  namedGroups: { [groupName: string]: FoundSubstring };
}

interface SearchResultData extends MatchObject {
  index: PositiveInteger;
  resultKey: string | number;
  position: PositiveInteger;
  match: FoundString;
  context: {
    before: SourceSubstringBeforeMatch;
    after: SourceSubstringAfterMatch;
  };
  replacement: string;
  groups: FoundSubstring[];
  source: string;
}

type ReplacementPattern = string;
type ReplacementCallback = (match: MatchObject) => string;
type PositiveInteger = number;
type FoundString = string;
type FoundSubstring = string;
type SourceSubstringBeforeMatch = string;
type SourceSubstringAfterMatch = string;
