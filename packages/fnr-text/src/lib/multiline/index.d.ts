import { FindrConfig, resultKey, FindrParams, FindrReturn } from '../index.d';

declare const fnrMultiLine: (params: FindrMultiLineParams) => FindrReturn;

export default fnrMultiLine;

export interface FindrMultiLineConfig
  extends Omit<FindrConfig, 'buildResultKey'> {
  buildResultKey?: (index: number, lineNumber: number) => resultKey;
}

export interface FindrMultiLineParams extends Omit<FindrParams, 'config'> {
  config?: FindrMultiLineConfig;
}
