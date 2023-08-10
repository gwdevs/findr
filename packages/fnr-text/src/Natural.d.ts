/** @namespace Natural */

/**
@description A natural number is an integer that is greater than or equal to 0
@memberof Natural
*/
export type Natural = { readonly Natural: unique symbol; n: number; }; 

/**
@description Parse a number to a Natural
@memberof Natural
*/
export declare const fromNumber : (n : Number) => Natural | null

/**
@description Converts a Natural to a number
@memberof Natural
*/
export declare const toNumber : (nat : Natural) => number