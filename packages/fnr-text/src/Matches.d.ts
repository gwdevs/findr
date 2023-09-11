/**
@module Matches
@description
@todo CHRIS: As you said down there, definitions of Matches and MatchIndex are
      are needed. The function definition makes sense
This module defines the results from performing a search
*/

/**
@memberof Matches
@description A collection of results from performing a search
@see {@link Search.search}
@todo define this
@todo in findr-mui it would make sense to define a `matchesToJSX : (m : Matches) => JSX`
*/
export interface Matches {}

/**
@description The index of a single match within Matches
@memberof Matches
*/
export interface MatchIndex {}

/**
@description Collect all indices from a set of Matches
@param matches - the result from a search
@memberof Matches
*/
export declare const matchIndices: (matches: Matches) => Array<MatchIndex>;
