/** 
@module Search

@description 
This module provides syntax for constructing searches across text.

@example search(matchCase(string("foo")), "foobarbaz")
@example search(regex(/foo/), "foobarbaz")
@see {@link Search.search}
*/

import { Natural } from "./Natural.d"


/**
@description A Search describes a cursor (or multi-cursor) into some text
@memberof Search
@todo define this as a Traversal into a string
*/
export interface Search {}

/**
@description A Regex can be a search.
@memberof Search
@todo include documentation for regex-group matching
*/
export declare const regex : (r : Regex) => Search

/**
@description A string is also a search
@memberof Search
@todo Because every string is a Regex it might be worth removing this function
and only providing {@link Search.regex}. This frees us from having to keep track
of both types of input and can possibly optimize for Regex.
*/
export declare const string : (s : String) => Search

/**
@description Modify a search to match a whole case
@example
  //matchCase is idempotent
  matchCase(matchCase(s)) === matchCase(s)
@memberof Search
*/
export declare const matchCase : (s : Search) => Search

/**
@description 
Modify a search to only match whole words
__NOTE__: this will not work if `string(s)` (where `s` contains spaces) is used!

@memberof Search
*/
export declare const matchWholeWord : (s : Search) => Search  

/**
@description 
When collecting the string for a particular match collect the surrounding context
@memberof Search
*/
export declare const setContext : (characterCount : Natural, s : Search) => Search 

/**
@description Obtain matches from a given string
@memberof Search
*/
export declare const search : (aSearch : Search, inputString : string) => Matches      