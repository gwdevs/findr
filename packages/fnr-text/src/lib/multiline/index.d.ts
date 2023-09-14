import { FindrConfig, ResultKey, SearchAndReplace, ReplacedAndResults } from '../index.d'

export declare const findrMultiLine: (params: FindrMultiLineParams) => ReplacedAndResults;

export default findrMultiLine;

export interface FindrMultiLineConfig
  extends Omit<FindrConfig, 'buildResultKey'> {
  buildResultKey?: (index: number, lineNumber: number) => ResultKey;
}

export interface FindrMultiLineParams extends Omit<SearchAndReplace, 'config'> {
  config?: FindrMultiLineConfig;
}
