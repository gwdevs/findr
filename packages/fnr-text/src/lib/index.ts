import { SearchAndReplace, SearchResult } from './index.d';
import * as S from './SourceAndFlags'

/** 
*  findr extends javascript's String.replace() by handling options like Preserve Case, 
*  Match Word, Regex, and allowing consumers to extend it further.
*  It formats it's response in a way that is easier to consume by a Find and Replace UI.
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
  
  const {regexBuilder, wordLike, uppercaseLetter} = 
    xre instanceof Function ? S.regexBuilderAndConfigFromFunction(xre) : S.defaultRegexAndConfig 

  const mkFinalRegex = (s : RegExp | string) : S.SourceAndFlags => 
    s instanceof RegExp ? S.fromRegex(s) : S.regexStringToRegexer(s) 

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

  let results : SearchResult[] = []

  //TODO: it might be worth using a Reader functor here...
  const replaceFunc_ = (a : any, b : any, c : any, ...d : any[]) => replaceFunc
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
    , ctxLen
    , filterCtxMatch
    , filterCtxReplacement
    )(a,b, c, ...d)(results)

  //TODO: rework the types involved so that this empty string check isn't required
  const replaced = target !== '' ? source.replace(wholeWordRegex, replaceFunc_) : source;

  return { results, replaced };
}

type ResultsBuilder = (results : SearchResult[]) => string

const onlyReplace = (s : string) : ResultsBuilder => () => s
 
const replaceAndResult = (s : string, r : SearchResult) : ResultsBuilder => (results : SearchResult[]) => {
  results.push(r)
  return s
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

  const hasReplacementKey = replacementKeys === 'all' || replacementKeys.includes(buildResultKey(replaceIndex) as string) 

  //TODO: once searchIndex has been made stateless 
  const searchIndex_ = searchIndex

  //TODO: this has been moved up as we refactor away the threading around of result
  if(!hasReplacementKey) {
    searchIndex++;
    replaceIndex++;
  }

  // REPLACE IF replacePointer IS INCLUDED IN replacementKeys given by user
  return hasReplacementKey
  ? /** if a replacementKey matches current result this result won't be included in the list of results */
    //TODO: why are we concatenating the first subgroup with the replaced text? 
    onlyReplace(auxMatch + replacedCaseHandled)
  : replaceAndResult(tmpMatch,
      {match: filterCtxMatch ? filterCtxMatch(match) : match,
      replacement: filterCtxReplacement ? filterCtxReplacement(replacedCaseHandled) : replacedCaseHandled,
      context: 
        { before: source.slice(pos - ctxLen, pos),
          after: source.slice(pos + match.length, pos + match.length + ctxLen) 
        },
      extContext: 
        { before: source.slice(0, pos),
          after: source.slice(pos + match.length, -1) 
        },
      resultKey: buildResultKey(searchIndex_),
      metadata: {
          //TODO: remove this since it's unecessary
          source: source,
          //TODO: remove this since it's unecessary
          match: match,
          searchIndex: searchIndex_,
          position: pos,
          groups: oldArgs,
          namedGroups,
          ...metadata,
      }}
    )
}}   
