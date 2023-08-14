export function findr<TSearchResultExtension extends ResultRecord>({
  source,
  pattern,
  replacement = '',
  replacementKeys = [],
  options: {
    isRegex = false,
    isCaseMatched = true,
    isWordMatched = false,
    isCasePreserved = false,
  } = {},
  hooks: { onSetResult } = {},
  config,
}: {
  source: SourceText;
  pattern: SearchPattern;
  replacement?: ReplacementPattern | ReplacementCallback;
  replacementKeys?: Array<Match['index']> | 'all';
  options?: {
    isRegex?: boolean;
    isCaseMatched?: boolean;
    isWordMatched?: boolean;
    isCasePreserved?: boolean;
  };
  hooks?: {
    onSetResult?: (result: FindrResult) => TSearchResultExtension;
  };
  config?: {
    regexer?: <P extends SearchPattern, F extends string>(
      pattern: P,
      flags: P extends RegExp ? undefined : F | undefined
    ) => RegExp;
    patterns?: {
      wordLike?: SearchPattern;
      uppercaseLetter?: SearchPattern;
    };
  };
}): {
  replaced: SourceTextWithReplacements;
  results: (FindrResult & TSearchResultExtension)[];
} {
  //build results and replaced
  return { results, replaced };
}

type ResultRecord = Record<string, unknown>;

interface Match {
  index: PositiveInteger;
  text: FoundString;
  groups: FoundSubstring[];
  position: PositiveInteger;
  source: string;
  namedGroups: { [groupName: string]: FoundSubstring };
}

interface FindrResult extends Match {
  context: {
    before: SourceSubstringBeforeMatch;
    after: SourceSubstringAfterMatch;
  };
  replacement: string;
}

/**
 * A searchable string. Findr suports searching English texts by default. Increase support by adding custom wordLike patterns to findr's config param.
 */
type SourceText = string;
type SourceTextWithReplacements = SourceText;
type SearchPattern = string | RegExp;
type ReplacementPattern = string;
type ReplacementCallback = (match: Match) => ReplacementPattern;
type PositiveInteger = number;
type FoundString = string;
type FoundSubstring = string;
type SourceSubstringBeforeMatch = string;
type SourceSubstringAfterMatch = string;
