/** 
@module Replacement
@description
This module defines the interface for performing text replacements 

@see {@link Replacement.fromSearch }
*/

import {Search} from './search'
import {MatchIndex} from './matches'

/**
@description Describes the various forms of replacement that can be made
@example
//replace matched occurences at indices 0 and 5 with "foo" but preserve
//the original case
and(replaceWith("foo"), include(0), include(5), preserveCase)  
@memberof Replacement
@todo define this
*/
export interface Replacement {}

/**
@description Replace nothing. This is the left and right identity of `and`

@example 
and(empty, r) === r === and(r, empty)

@example 
//an empty replacement on a search does nothing to the final result
replace(replace(empty, search(s, i))) === i 

@memberof Replacement
*/
export declare const empty : Replacement

/**
@description Replace all occurences with a given string
@memberof Replacement
*/
export declare const replaceWith : (replacementString : string) => Replacement

/**
@description Perserve the case of all replacements
@memberof Replacement
*/
export declare const preserveCase : Replacement

/**
@description Include only match at the given MatchIndex in the replacement
@memberof Replacement
*/
export declare const include : (matchIndex : MatchIndex) => Replacement

/**
@description Perform all the replacements
@memberof Replacement
*/
export declare const all : (...replacements : Array<Replacement>) => Replacement

/**
@description The index of a regex matched group
@todo define this
*/
export interface GroupIndex {}

/**
@description Perform a replacement on a specific regex group
@memberof Replacement
*/
export declare const onGroup : (groupIndex : GroupIndex) => Replacement       

/**
@description 
Every search is a Replacement that, on its own, does nothing.
You probably want to start here when constructing a Replacement
__NOTE__: The context of a search is _ignored_ when performing replacements
@memberof Replacement
*/
export declare const fromSearch : (search : Search) => Replacement

/**
@description run a replacement over an input string
@memberof Replacement
*/
export declare const replace : (replacement : Replacement, inputString : string) => string 