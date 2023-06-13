export interface UseFindAndReplace {
  count: number;
  increment: () => void;
}

export type GenericObject = { [key: string]: unknown };

interface OnSearchProps<O = undefined> {
  target: string;
  replacement: string;
  sourceKey: SourceKey;
  options?: O;
}

export type ResultKey = string | number;

type ResultsKeys = Array<ResultKey> | string | null;

interface OnReplaceProps<Options = undefined> extends OnSearchProps<Options> {
  resultsKeys?: ResultsKeys;
}

type OnSearchCallback<Result, Options = undefined> = (
  args: OnSearchProps<Options>
) => Result[] | Promise<Result[]>;

type OnReplaceCallback<Result, Options = undefined> = (
  args: OnReplaceProps<Options>
) => Result[] | Promise<Result[]>;

export interface UseFindAndReplaceProps<
  Result = undefined,
  Options = undefined
> {
  sourcesKeys?: Array<string>;
  metadata?: { [key: string]: unknown };
  onSearch: OnSearchCallback<Result, Options>;
  onReplace: OnReplaceCallback<Result, Options>;
}

export type Metadata = { [key: string]: unknown };

export interface Group<Result> {
  key: string;
  title?: string;
  hoverText?: string;
  results: Result[];
  metadata?: {
    [key: string]: unknown;
  };
}

type Groups<Result> = Record<string, Group<Result>>;

type SourceKey = string;

interface Result {
  resultKey: ResultKey;
  sourceKey: SourceKey;
}

export interface OnReplaceAllProps extends OnSearchProps<O> {
  groups: Groups<R>;
}
export interface OnReplaceGroupProps extends OnSearchProps<O> {
  group: Group<R>;
}
export interface OnReplaceResultProps extends OnSearchProps<O> {
  result: R;
}