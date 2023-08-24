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
    ( regexBuilder
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

function replacementCallbackFunc
  ( replacement : ReplacementCallback
  , replaceIndex: number
  , match: string
  , args: any[]
  , pos: any
  , source: any
  , namedGroups: any
  ) : () => string {return () => replacement({ index: replaceIndex, match, groups: args, position: pos, source, namedGroups })}
  
function replacementString(s : string) : (() => string) {return () => s}

function isUpperCase(input: string) {
  //TODO: this is equivalent to ()
  return input.toUpperCase() === input && input.toLowerCase() !== input;
}

function evaluateCase(regexer : S.Regexer, uppercaseLetter : string, isCasePreserved : boolean, match: string, replaced: string) {

  //the goal here is: 
  //'foo' -> 'bar'
  //'FOO' -> 'BAR'
  //'Foo' -> 'Bar'

  //if we are not preserving the case of the match then abort...
  if (!isCasePreserved)
      return replaced;

  //if the whole string is upper case return its upper cased version
  if (isUpperCase(match)) {
      return replaced.toUpperCase();
  }

  //if the first letter of the match is uppercase then set the first letter of the replaced
  //string to uppercase
  if (regexer(uppercaseLetter).test(match[0])) {
      return replaced[0].toUpperCase() + replaced.slice(1);
  }

  return replaced;
}

function replaceFunc
  ( regexer : any
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
  ) { return (...args: any[]) => {

  //TODO: invert the logic here. According to the MDN documentation these variables can be inferred
  //from the initialRgx value. That is, the instance of `...args` can be inferred directly from
  //the initialRgx construction. I recommend reworking the type of initalRgx to make this implication
  //easier. 

  // START BUILDING MATCH DATA
  /** if the last argument of string.replace callback is an object it means the regexp contains groups */
  const { match, pos, source, namedGroups, auxMatch, tmpMatch } = handleRegexGroups(args);

  //TODO: name binding masks already defined name binding (defined on line 94)
  /** replacement string modified to match findr's replacement config */
  const replaced = 
    evaluateCase(regexer, uppercaseLetter, isCasePreserved, match,
        match.replace(finalRgx, 
          typeof replacement === 'function' 
            ?  replacementCallbackFunc(replacement, replaceIndex, match, args, pos, source, namedGroups)
            : replacementString(replacement)
        )
    )

  //TODO: I don't this interface to buildResultKey is a good idea...just a gut feeling here.
  /** key for specific match index that needs to be replaced */
  const replacePointer: ResultKey = buildResultKey
      ? buildResultKey(replaceIndex)
      : replaceIndex;

  replaceIndex++;

  // REPLACE IF replacePointer IS INCLUDED IN replacementKeys given by user
  if (replacementKeys === 'all' ||
      replacementKeys.includes(replacePointer as string)) {
      /** if a replacementKey matches current result this result won't be included in the list of results */
      return auxMatch + replaced;
  }

  //TODO: add result metadata as filterCtxReplacement arg
  const result = {
      match: filterCtxMatch ? filterCtxMatch(match) : match,
      replacement: filterCtxReplacement ? filterCtxReplacement(replaced) : replaced,
      context: { before: source.slice(pos - ctxLen, pos), after: source.slice(pos + match.length, pos + match.length + ctxLen) },
      extContext: { before: source.slice(0, pos), after: source.slice(pos + match.length, -1) },
      resultKey: buildResultKey(searchIndex),
      metadata: {
          source: source,
          match: match,
          searchIndex,
          position: pos,
          groups: args,
          namedGroups,
          ...metadata,
      },
  };

  results.push(result);

  //TODO: is there a stateless way to do this? It's difficult to follow the denotational semantics
  //of the code given a stateful variable like this.
  searchIndex++;

  return tmpMatch;
}}

function handleRegexGroups(args: any[]) : { match: string; pos: any; source: any; namedGroups: any; auxMatch: any; tmpMatch: any; } {
  const containsGroup = typeof args[args.length - 1] === 'object';

  /** get the groups if they exist and remove them from args */
  const namedGroups = containsGroup ? args.pop() : undefined;
  const source = args.pop();
  const tmpPos = args.pop();
  const tmpMatch = args.shift();
  const auxMatch = args.shift();
  const pos = tmpPos + auxMatch.length;
  const match = args.shift();

  return { match, pos, source, namedGroups, auxMatch, tmpMatch };
}     

