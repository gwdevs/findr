import { SearchAndReplace, SearchResult, ResultKey } from './index.d';
import { escapeRegExp, evalRegex, isUpperCase } from './utils';

type RegexFlags = Array<string>;

/** 
*  findr extends javascript's String.replace() by handling options like Preserve Case, 
*  Match Word, Regex, and allowing consumers to extend it further.
*  It formats it's response in a way that is easier to consume by a Find and Replace UI.
*/
export function findr({
  source,
  target,
  replacement = '',
  replacementKeys = [],
  metadata,
  config: {
    filterCtxMatch = (match: string) => match,
    filterCtxReplacement = (replacement: string) => replacement,
    buildResultKey,
    ctxLen = 0,
    xregexp: xre,
    isRegex = false,
    isCaseMatched = true,
    isWordMatched = false,
    isCasePreserved = false,
  } = {},
}: SearchAndReplace) {
  // START BUILDING SEARCH REGEXP

  /** default flags to be used for regex pattern */
  const defaultFlags : RegexFlags =  !isCaseMatched ? ['g', 'i'] : ['g'];

  const _isRegex = typeof isRegex === 'boolean' ? isRegex : isRegex === 'true';

  /** is findr being used in regex mode */
  const _isRegex = typeof isRegex === 'boolean' ? isRegex : isRegex === 'true';
  if (!_isRegex && target instanceof RegExp)
    console.warn('isRegex is set to false but target of type RegExp given.');

  /** is user providing an instance of XRegExp */
  const isXre = xre instanceof Function;

  /** regex engine (default or xregexp) */
  const regexer = isXre
    ? xre
    : function (source: string, flags = '') {
        return new RegExp(source, flags);
      };

  /** regex pattern for a wordlike character */
  const WordLike = isXre ? `p{Letter}\\p{Number}` : `\\w\\d`; // needs increased support for multiple languages

  /** regex pattern for uppercase character */
  const UppercaseLetter = isXre ? `\\p{Uppercase_Letter}` : `[A-Z]`; // needs increased support for multiple languages

  /** adds patterns needed to fit findr's config to a given RegExp */
  function prepareRegExp({
    regexp,
    isWordMatched,
  }: {
    regexp: RegExp;
    isWordMatched: boolean;
  }) {
    const { source, flags } = regexp;
    return isWordMatched
      ? regexer(`(^|[^${WordLike}])(${source})(?=[^${WordLike}]|$)`, flags)
      : regexer(`()(${source})`, flags);
  }

  /** regex gotten from findr's target input */
  const rgxData = _isRegex
    ? evalRegex(target)
    : { source: escapeRegExp(target), flags: null };

  /** merged default flags with inputted flags */
  const flags = rgxData.flags
    ? [...new Set([...rgxData.flags, ...defaultFlags])]
    : defaultFlags;

  /** clean regex without findr's search configs */
  const finalRgx = regexer(rgxData.source, flags.join(''));

  /** regex with findr's search config */
  const initialRgx = prepareRegExp({
    regexp: finalRgx,
    isWordMatched,
  });

  //START FINDING AND REPLACING

  let searchIndex = 0;
  let replaceIndex = 0;
  const results: SearchResult[] = [];
  const replaced =
    target !== ''
      ? source.replace(initialRgx, function (...args) {
          // START BUILDING MATCH DATA

          /** if the last argument of string.replace callback is an object it means the regexp contains groups */
          const containsGroup = typeof args[args.length - 1] === 'object';
          /** get the groups if they exist and remove them from args */
          const namedGroups = containsGroup ? args.pop() : undefined;
          const source = args.pop();
          const tmpPos = args.pop();
          const tmpMatch = args.shift();
          const auxMatch = args.shift();
          const pos = tmpPos + auxMatch.length;
          const match: string = args.shift();

          // START BUILDING REPLACEMENT STRING

          /** gets the replacement string from findr's replacement input */
          const replacementCB = function (): string {
            if (typeof replacement === 'function') {
              const rep = replacement({
                index: replaceIndex,
                match,
                groups: args,
                position: pos,
                source,
                namedGroups,
              });
              return rep;
            }
            if (typeof replacement === 'string') {
              return replacement;
            }
            throw new Error(
              'Replacement param should be of type string or function.'
            );
          };

          /** replacement string from findr's replacement input */
          const r = replacementCB();

          /** modifies replacement string according to findr's replacement config */
          const evaluateCase = (match: string, replaced: string) => {
            //TODO: Add callback to allow users to make their own case evaluation;
            if (!isCasePreserved) return replaced;
            if (isUpperCase(match)) {
              return replaced.toUpperCase();
            }
            if (new RegExp(regexer(UppercaseLetter)).test(match[0])) {
              return replaced[0].toUpperCase() + replaced.slice(1);
            }
            return replaced;
          };

          /** replacement string modified to match findr's replacement config */
          const replaced = evaluateCase(match, match.replace(finalRgx, r));

          /** key for specific match index that needs to be replaced */
          const replacePointer: ResultKey = buildResultKey
            ? buildResultKey(replaceIndex)
            : replaceIndex;
          replaceIndex++;

          // REPLACE IF replacePointer IS INCLUDED IN replacementKeys given by user

          if (
            replacementKeys === 'all' ||
            replacementKeys.includes(replacePointer as string)
          ) {
            /** if a replacementKey matches current result this result won't be included in the list of results */
            return auxMatch + replaced;
          }

          // START BUILDING THE RESULT IF MATCH IS NOT REPLACED

          /** substring before matched result */
          const ctxBefore = source.slice(pos - ctxLen, pos);
          /** substring after matched result */
          const ctxAfter = source.slice(
            pos + match.length,
            pos + match.length + ctxLen
          );

          /** all source text before matched result */
          const extCtxBefore = source.slice(0, pos);
          /** all source text after matched result */
          const extCtxAfter = source.slice(pos + match.length, -1);

          const ctxMatch = filterCtxMatch ? filterCtxMatch(match) : match;
          const ctxReplacement = filterCtxReplacement
            ? filterCtxReplacement(replaced)
            : replaced;

          /** creates a pointer to this result */
          const searchPointer = buildResultKey
            ? buildResultKey(searchIndex)
            : searchIndex;

          //TODO: add result metadata as filterCtxReplacement arg
          const result = {
            match: ctxMatch,
            replacement: ctxReplacement,
            context: { before: ctxBefore, after: ctxAfter },
            extContext: { before: extCtxBefore, after: extCtxAfter },
            resultKey: searchPointer,
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
          searchIndex++;
          return tmpMatch;
        })
      : source;
  return { results, replaced };
}

export default findr
