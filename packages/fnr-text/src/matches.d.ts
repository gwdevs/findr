/** 
@module Matches
@description
This module defines the results from performing a search
*/

/**
@memberof Matches
@description A collection of results from performing a search
@see {@link Search.search}
@todo define this
@todo in findr-mui it would make sense to define a `matchesToJSX : (m : Matches) => JSX`
*/
export type Matches = undefined    

/**
@description The index of a single match within Matches
@memberof Matches
*/
export type MatchIndex = undefined

/**
@description Collect all indices from a set of Matches
@memberof Matches
*/
export declare const matchIndices : (matches : Matches) => Array<MatchIndex>
