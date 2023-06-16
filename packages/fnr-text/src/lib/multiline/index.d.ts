import { FindrConfig, resultKey, FindrParams, FindrReturn } from '../index.d'

export declare const findrMultiLine: (params: FindrMultiLineParams) => FindrReturn;

export default findrMultiLine;

export interface FindrMultiLineConfig
  extends Omit<FindrConfig, 'buildResultKey'> {
  buildResultKey?: (index: number, lineNumber: number) => resultKey;
}

export interface FindrMultiLineParams extends Omit<FindrParams, 'config'> {
  config?: FindrMultiLineConfig;
}
