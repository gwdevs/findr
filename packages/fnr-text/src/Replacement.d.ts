/**
@module Replacement
@description
This module defines the interface for performing text replacements
@example
  replace
  ( all
      ( fromSearch(Search.matchCase(Search.string("foo")))
      , include(0)
      , include(5)
      , withString("replace")
      )
  , "barFoobaz"
  )
  === "barReplacebaz"
@see {@link Replacement.replace }
@see {@link Replacement.fromSearch }
*/

/**
 * @todo Chris
 *        Reading through code and commenting like this is fun. Also I
 *        definitely understand it better taking it in via smaller chunks
 */

import { Search } from './search';
import { MatchIndex } from './matches';

/**
@description This describes how to replace matched text after a search is performed
@example
//replace matched occurences at indices 0 and 5 with "foo" but preserve
//the original case
and(replaceWith("foo"), include(0), include(5), preserveCase)
CHRIS: This example and the previous were helpful! Are 'includes' saying that
       we will replace the first and sixth occurrences of our searched text?
       Two mintes later... Oh now I get the 'and' too after reading further.
       My brain takes a minute to read boolean operations in functions.
@memberof Replacement
@todo define this as a text Traversal
Chris: truly truly
*/
export interface Replacement {}

/**
@description Replace nothing. This is the left and right identity of `and`

@example
and(empty, r) === r === and(r, empty)

@example
//an empty replacement on a search does nothing to the final result
// CHRIS: Is the double replace purposeful?
          Two mintes later... Oh now I get it after reading further down
replace(replace(empty, search(s, i))) === i

@memberof Replacement
*/
export declare const empty: Replacement;

/**
@description Replace all occurences with a given string
@memberof Replacement
*/
export declare const withString: (replacementString: string) => Replacement;

/**
@description Perserve the case of all replacements
@memberof Replacement
*/
export declare const preserveCase: Replacement;

/**
@description Include only match at the given MatchIndex in the replacement
@memberof Replacement
*/
export declare const include: (matchIndex: MatchIndex) => Replacement;

/**
@description Perform all the replacements
@memberof Replacement
*/
export declare const all: (...replacements: Array<Replacement>) => Replacement;

/**
@description The index of a regex matched group
@todo define this
Chris: truly truly
*/
export interface GroupIndex {}

/**
@description Perform a replacement on a specific regex group
@memberof Replacement
*/
export declare const onGroup: (groupIndex: GroupIndex) => Replacement;

/**
@description
Every search is a Replacement that, on its own, does nothing.
You probably want to start here when constructing a Replacement
__NOTE__: The context of a search is _ignored_ when performing replacements

@memberof Replacement
@see {@link Search.Search}
*/
export declare const fromSearch: (search: Search) => Replacement;

/**
@description run a replacement over an input string
@memberof Replacement
@todo it might be worthwhile merging {@link Replacement.all} with this:
```
replace : (...replacements : Array<Replacement>, inputString : string) => string
```
*/
export declare const replace: (
  replacement: Replacement,
  inputString: string
) => string;
