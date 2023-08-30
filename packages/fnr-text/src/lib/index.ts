import { SearchAndReplace, SearchResult, ResultKey, ReplacementCallback } from './index.d';
import * as S from './SourceAndFlags'

/** 
*  findr extends javascript's String.replace() by handling options like Preserve Case, 
*  Match Word, Regex, and allowing consumers to extend it further.
*  It formats it's response in a way that is easier to consume by a Find and Replace UI.
*/

/*
TODO: Code Readability Suggestions

It could be helpful to **separate Findr and Multiline into separate
files and then import/export them in `index.ts`**.  It’s harder exploring
through the codebase when I’m sorting through which `index.ts` file I’m looking at.
- It also makes the imports within the files more readable (I get confused when
  I see imports of index files and which folder they’re being imported from.
  Like import x from “../../.”)

A lot of the code was in one bigger function. **Creating smaller functions that
group similar operations** (creating flags, preparing initial regex, etc.)
**could help improve readability.**
  1. For Example…
      1. Wrapping the functionality in `source.replace` on **line 74** in a function
      2. Wrapping the `defaultFlags` const with other code that generates flags
      3. etc.
*/

export default function findr({
  source,
  target,
  replacement = '',
  replacementKeys = [],
  metadata,
  config: {
    filterCtxMatch = (match: string) => match,
    filterCtxReplacement = (replacement: string) => replacement,
    buildResultKey = (searchIndex : number) => searchIndex,
    ctxLen = 0,
    //TODO: rename xre - it's difficult to follow
    xregexp: xre,
    isCaseMatched = true,
    isWordMatched = false,
    isCasePreserved = false,
  } = {},
}: SearchAndReplace) {
  // START BUILDING SEARCH REGEXP

  /** default flags to be used for regex pattern */
  const defaultFlags : S.RegexFlags =  !isCaseMatched ? S.mergeFlags(S.global, S.caseInsensitive) : S.global;

  /** regex engine (default or xregexp) */
  /** is user providing an instance of XRegExp */
  const {regexBuilder, wordLike, uppercaseLetter} = xre instanceof Function
    ? { regexBuilder: xre 
      //TODO: needs increased support for multiple languages
      /** regex pattern for a wordlike character */
      , wordLike: `p{Letter}\\p{Number}` 

      /** regex pattern for uppercase character */
      , uppercaseLetter: `\\p{Uppercase_Letter}` 
      }

    : { regexBuilder: (source: string, flags = '') => new RegExp(source, flags)
      /** regex pattern for a wordlike character */
      , wordLike : `\\w\\d`

      /** regex pattern for uppercase character */
      , uppercaseLetter: `[A-Z]`
      }


  const mkFinalRegex = (s : RegExp | string) : S.SourceAndFlags => s instanceof RegExp ? S.fromRegex(s) : S.regexStringToRegexer(s) 

  const targetRegex = mkFinalRegex(target)(regexBuilder, defaultFlags)
      
  /** regex with findr's search config */
  const { source: source_, flags: flags_ } = targetRegex

  /** adds patterns needed to fit findr's config to a given RegExp */
  const wholeWordRegex = isWordMatched
      ? regexBuilder(`(^|[^${wordLike}])(${source_})(?=[^${wordLike}]|$)`, flags_)
      : regexBuilder(`()(${source_})`, flags_);

  //START FINDING AND REPLACING

  let searchIndex = 0;
  let replaceIndex = 0;

  //TODO: place: initial array ---> array construction logic ---> final array with a fold/reduce pattern
  const results: SearchResult[] = [];

  const replaceFunc_ = replaceFunc
    ( source
    , regexBuilder
    , uppercaseLetter
    , isCasePreserved
    , targetRegex
    , replacement
    , replaceIndex
    , buildResultKey
    , replacementKeys
    , metadata
    , searchIndex
    , results
    , ctxLen
    , filterCtxMatch
    , filterCtxReplacement
    )

  //TODO: rework the types involved so that this empty string check isn't required
  const replaced = target !== '' ? source.replace(wholeWordRegex, replaceFunc_) : source;

  return { results, replaced };
}

function replaceFunc
  ( source : string
  , regexer : any
  , uppercaseLetter : any
  , isCasePreserved : any
  , finalRgx : any
  , replacement : any
  , replaceIndex : any
  , buildResultKey : any
  , replacementKeys : any
  , metadata : any
  , searchIndex : any
  , results : any
  , ctxLen : any
  , filterCtxMatch : any
  , filterCtxReplacement : any
  ) { return (tmpMatch: any, auxMatch: string | any[], match: string, ...args: any[]) => {

  //TODO: invert the logic here. According to the MDN documentation these variables can be inferred
  //from the initialRgx value. That is, the instance of `...args` can be inferred directly from
  //the initialRgx construction. I recommend reworking the type of initalRgx to make this implication
  //easier. 

  // START BUILDING MATCH DATA
  const hasGroups = typeof args.at(-1) === 'object'

  const namedGroups = hasGroups ? args.at(-1) : undefined;

  //TODO: rename this to something more understandable
  const pos = args.at(hasGroups ? -3 : -2) + auxMatch.length;

  
  //TODO: remove the need for oldArgs (this will break the legacy API)
  //in order to maintain the legacy behavior of args we need to modify the args array
  const oldArgs = args.slice(0, hasGroups ? -3 : -2)

  /** if the last argument of string.replace callback is an object it means the regexp contains groups */
  //TODO: why is the `match` the 3rd subgroup?
  const replacedText = match.replace
    (finalRgx, 
      //TODO: invert the dependencies here
      typeof replacement === 'function' 
        ? () => replacement({ index: replaceIndex, match, groups: oldArgs, position: pos, source, namedGroups })
        : () => replacement
    )

  /** replacement string modified to match findr's replacement config */
  const replacedCaseHandled = 
    !isCasePreserved ? replacedText
    : String(match).toUpperCase() === match ? String(replacedText).toUpperCase() 
    : regexer(uppercaseLetter).test(match[0]) ? replacedText[0].toUpperCase() + replacedText.slice(1)
    : replacedText


  //TODO: I don't this interface to buildResultKey is a good idea...just a gut feeling here.
  //TODO: unify the return results
  // REPLACE IF replacePointer IS INCLUDED IN replacementKeys given by user
  if (replacementKeys === 'all' || replacementKeys.includes(buildResultKey(replaceIndex) as string) ) 
  { /** if a replacementKey matches current result this result won't be included in the list of results */
    //TODO: why are we concatenating the first subgroup with the replaced text? 
    return auxMatch + replacedCaseHandled;
  }

  //TODO: add result metadata as filterCtxReplacement arg
  results.push({
      match: filterCtxMatch ? filterCtxMatch(match) : match,
      replacement: filterCtxReplacement ? filterCtxReplacement(replacedCaseHandled) : replacedCaseHandled,
      context: 
        { before: source.slice(pos - ctxLen, pos),
          after: source.slice(pos + match.length, pos + match.length + ctxLen) 
        },
      extContext: 
        { before: source.slice(0, pos),
          after: source.slice(pos + match.length, -1) 
        },
      resultKey: buildResultKey(searchIndex),
      metadata: {
          //TODO: remove this since it's unecessary
          source: source,
          //TODO: remove this since it's unecessary
          match: match,
          searchIndex,
          position: pos,
          groups: oldArgs,
          namedGroups,
          ...metadata,
      },
  })

  //TODO: is there a stateless way to do this? It's difficult to follow the denotational semantics
  //of the code given a stateful variable like this.
  searchIndex++;
  replaceIndex++;

  return tmpMatch;
}}  
