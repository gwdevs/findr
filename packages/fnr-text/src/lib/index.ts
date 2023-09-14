import * as C from './CaseHandler';
import { SearchAndReplace, SearchResult } from './index.d';
import * as R from './ResultsBuilder';
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
  metadata: mdata,
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
  // CHRIS: Yay this is more readable. What does the global flag do?
  const defaultFlags : S.RegexFlags =  !isCaseMatched ? S.mergeFlags(S.global, S.caseInsensitive) : S.global;
  
  // CHRIS: What does wordLike mean?
  const {regexBuilder, wordLike } = 
    xre instanceof Function ? S.regexBuilderAndConfigFromFunction(xre) : S.defaultRegexAndConfig 

  // CHRIS: The name 'mkFinalRegex' does point to the fact that it is a function,
  // but the SourceAndFlags type doesn't sound like a function
  const mkFinalRegex = (s : RegExp | string) : S.SourceAndFlags => 
    s instanceof RegExp ? S.fromRegex(s) : S.regexStringToRegexer(s) 

  const targetRegex = mkFinalRegex(target)(regexBuilder, defaultFlags)
      
  /** regex with findr's search config */
  const { source: source_, flags: flags_ } = targetRegex

  const regexWithWholeWord = regexBuilder(`(^|[^${wordLike}])(${source_})(?=[^${wordLike}]|$)`, flags_)

  const onlySourceRegex = regexBuilder(`()(${source_})`, flags_)

  /** adds patterns needed to fit findr's config to a given RegExp */
  // CHRIS: Is wholeWordRegex a good name if we aren't always matching the whole word?
  const wholeWordRegex = isWordMatched ? regexWithWholeWord : onlySourceRegex

  //START FINDING AND REPLACING
  let searchIndex = 0;
  let results : SearchResult[] = []

  // CHRIS: The andThen function was confusing to wrap my brain around
  const createReplacement = 
    C.andThen
    ( typeof replacement === 'function' ? (replacement as C.CaseHandler<string>) 
      : C.pure(replacement)
    , isCasePreserved ? C.maintainCase : C.pure 
    )

  //TODO: it might be worth using a Reader functor here...
  // CHRIS: Single-character variables are scary.
  // Combining that and currying can make this function look alien
  const replaceFunc_ = (a : any, b : any, c : any, ...d : any[]) => replaceFunc
    ( source
    , createReplacement
    , buildResultKey
    , replacementKeys
    , searchIndex
    , ctxLen
    , filterCtxMatch
    , filterCtxReplacement
    )(a,b, c, ...d)(results, searchIndex)

  //TODO: rework the types involved so that this empty string check isn't required
  const replaced = target !== '' ? source.replace(wholeWordRegex, replaceFunc_) : source;

  //TODO: break the external API so this is no longer needed
  // CHRIS: Yeah this is a little weird
  const adjoinMetadata = ({metadata, ...result} : SearchResult) => 
    ({ metadata : {...metadata, source, match: result.match, ...mdata}
    , ...result
    })

  return { results: results.map(adjoinMetadata), replaced };
}

function replaceFunc
  ( source : string
  , createReplacement : C.CaseHandler<string>
  //TODO: eliminate from function argument
  , buildResultKey : any
  , replacementKeys : any
  //TODO: eliminate from function argument
  , searchIndex : any
  , ctxLen : any
  , filterCtxMatch : any
  , filterCtxReplacement : any
  ) { return (entireStringMatch: any, preWordSpaceCharacter: string | string[], subStringMatch: string, ...args: any[]) => {

  //TODO: invert the logic here. According to the MDN documentation these variables can be inferred
  //from the initialRgx value. That is, the instance of `...args` can be inferred directly from
  //the initialRgx construction. I recommend reworking the type of initalRgx to make this implication
  //easier. 

  // START BUILDING MATCH DATA
  const hasGroups = typeof args.at(-1) === 'object'

  const namedGroups = hasGroups ? args.at(-1) : undefined;

  //TODO: rename this to something more understandable
  // CHRIS: Agree ^
  const pos = args.at(hasGroups ? -3 : -2) + preWordSpaceCharacter.length;
  
  //TODO: remove the need for oldArgs (this will break the legacy API)
  //in order to maintain the legacy behavior of args we need to modify the args array
  const oldArgs = args.slice(0, hasGroups ? -3 : -2)

  /** replacement string modified to match findr's replacement config */
  const replacedCaseHandled = createReplacement(
    { index: searchIndex
    , match: subStringMatch
    , groups: oldArgs
    , position: pos
    , source
    , namedGroups 
    })

  // REPLACE IF replacePointer IS INCLUDED IN replacementKeys given by user
  //TODO: why are we concatenating the first subgroup with the replaced text? 
  // CHRIS: I think this exploded my brain.
  return R.ifElse(
   R.map(R.searchIndex, i => replacementKeys === 'all' || replacementKeys.includes(buildResultKey(i)))
  , R.pure(preWordSpaceCharacter + replacedCaseHandled)
  , R.replaceAndResult(entireStringMatch,
      {match: filterCtxMatch ? filterCtxMatch(subStringMatch) : subStringMatch,
      replacement: filterCtxReplacement ? filterCtxReplacement(replacedCaseHandled) : replacedCaseHandled,
      context: 
        { before: source.slice(pos - ctxLen, pos),
          after: source.slice(pos + subStringMatch.length, pos + subStringMatch.length + ctxLen) 
        },
      extContext: 
        { before: source.slice(0, pos),
          after: source.slice(pos + subStringMatch.length, -1) 
        },
      resultKey: buildResultKey(searchIndex),
      metadata: {
          searchIndex,
          position: pos,
          groups: oldArgs,
          namedGroups,
      }}
    )
  )
}}   
