import { FindrConfig, resultKey, FindrParams } from "../findr";

export interface FindrMultiLineConfig
  extends Omit<FindrConfig, "buildResultKey"> {
  buildResultKey?: (index: number, lineNumber: number) => resultKey;
}

export interface FindrMultiLineParams extends Omit<FindrParams, "config"> {
  config?: FindrMultiLineConfig;
}
