import { SearchAndReplace, SearchResult, ResultKey } from './index.d';
import { escapeRegExp, evalRegex, isUpperCase } from './utils';

type RegexFlags = Array<string>;

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
    //TODO: rename xre - it's difficult to follow
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

  //TODO: is this necessary? isRegex is typed to be a boolean. If users are
  //using TS this check is unecessary. If the users are using JS to consume this
  //library maybe we should think about a more generic way to enforce types at 
  //runtime?
  /** is findr being used in regex mode */
  isRegex = typeof isRegex === 'boolean' ? isRegex : isRegex === 'true';

  //TODO: I would recommend against using console.warn as an error handling mechanism
  //this cloggs up the users console and doesn't provide the user an ability to handle
  //this error. If this is not an error then either:
  // - encode proper behavior in the types so it is impossible for users to "do the wrong thing"
  // - add a note in the documentation comment for `findr` so that users know what they should expect 
  //   if the condition is met.
  if (!isRegex && target instanceof RegExp)
    console.warn('isRegex is set to false but target of type RegExp given.');


  //TODO: this could be defunctionalized...
  //TODO: code-smell. Typically when you have an boolean and you're doing if-then statements based
  //on that boolean then there's a logic inversion that can be performed to simplify the code (defunctionalization).
  /** regex engine (default or xregexp) */
  /** is user providing an instance of XRegExp */
  const isXre = xre instanceof Function;

  const regexer = isXre
    ? xre
    : function (source: string, flags = '') {
        return new RegExp(source, flags);
      };

  //TODO: I'm seeing a code-smell here. Performing if-then statements to variable assignment
  //is running an evaluator to early. 
  //TODO: needs increased support for multiple languages
  /** regex pattern for a wordlike character */
  const wordLike = isXre ? `p{Letter}\\p{Number}` : `\\w\\d`;

  /** regex pattern for uppercase character */
  const uppercaseLetter = isXre ? `\\p{Uppercase_Letter}` : `[A-Z]`;

  //TODO: code-smell.. you're defining a function but it's only being called once elsewhere 
  //TODO: could we move this out of the scope of findr?
  //TODO: add return type annotation
  /** adds patterns needed to fit findr's config to a given RegExp */
  function prepareRegExp({
    regexp,
    isWordMatched,
  }: {
    regexp: RegExp;
    isWordMatched: boolean;
  }) {
    const { source, flags } = regexp;
    //TODO: you have here an EDSL for constructing regexes...why not make this its own module?
    return isWordMatched
      ? regexer(`(^|[^${wordLike}])(${source})(?=[^${wordLike}]|$)`, flags)
      : regexer(`()(${source})`, flags);
  }

  /** regex gotten from findr's target input */
  const rgxData = isRegex
    ? evalRegex(target)
    : { source: escapeRegExp(target), flags: null };

  //TODO: this could be a small EDSL under with Semigroup, Monoid, etc. instances
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

  //TODO: place: initial array ---> array construction logic ---> final array with a fold/reduce pattern
  const results: SearchResult[] = [];
  //TODO: there is a lot going on within this single variable assignment. I suggest refactoring this logic to
  //make the `... ? ... : ...` syntax more clear.
  //TODO: rework the types involved so that this empty string check isn't required
  const replaced =
    target !== ''
      ? source.replace(initialRgx, function (...args) {
          //TODO: invert the logic here. According to the MDN documentation these variables can be inferred
          //from the initialRgx value. That is, the instance of `...args` can be inferred directly from
          //the initialRgx construction. I recommend reworking the type of initalRgx to make this implication
          //easier. 
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

          //TODO: any function with the type `() -> a` is isomorphic to `a`. The only difference
          //is that `() -> a` is a thunk and `a` is not. do we need to do lazy evaluation here?
          // START BUILDING REPLACEMENT STRING

          /** gets the replacement string from findr's replacement input */
          const replacementCB = function (): string {
            //TODO: the type of `replacement` (according to index.d.ts) is a string. Here I recommend any of:
            //  - update the type to properly reflect the potential inputs
            //  - remove this check for `function` since it would be impossible to pass in a function
            //I highly recommend the first one as it will give clear insight to a better API (typically when a variable
            //can be a function type or a primitive type you are running into a poor user interace)
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
              //TODO: remove intermittent `returns` from body of function. This is a personal suggestion
              //as it makes it difficult to follow the logic of what's going on here.
              return replacement;
            }
            //TODO: could we make the error type being thrown here more well typed (as apposed to just a string?)
            throw new Error(
              'Replacement param should be of type string or function.'
            );
          };

          //TODO: code-smell. Variable name is a single letter. Typically this indicates a name-binding that has 
          //little denotational semantics. If this is the case can we remove the variable, otherwise rename it 
          //to something more meaningful.
          /** replacement string from findr's replacement input */
          /** modifies replacement string according to findr's replacement config */
          const r = replacementCB();

          //TODO: code-smell: this function has a single callsite. Typically this means we can rework the logic to
          //not need the function or replace the function 
          //TODO: co
          const evaluateCase = (match: string, replaced: string) => {
            //TODO: Add callback to allow users to make their own case evaluation;
            if (!isCasePreserved) return replaced;
            if (isUpperCase(match)) {
              return replaced.toUpperCase();
            }
            if (new RegExp(regexer(uppercaseLetter)).test(match[0])) {
              return replaced[0].toUpperCase() + replaced.slice(1);
            }
            return replaced;
          };

          //TODO: name binding masks already defined name binding (defined on line 94)
          /** replacement string modified to match findr's replacement config */
          const replaced = evaluateCase(match, match.replace(finalRgx, r));

          //TODO: I don't this interface to buildResultKey is a good idea...just a gut feeling here.
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

          //TODO: code-smell: this variable is only used once and its callsite is assignment to an object key.
          //in essense there are 2 names assigned to something that only has one meaning.
          //I would recommend removing this variable assignment. This applies to the following name-bindings:
          //  - ctxBefore
          //  - ctxAfter
          //  - ctxMatch
          //  - ctxReplacement
          //  - searchPointer
          //  - result (this is only being used as the argument to `results.push`)
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
          //TODO: is there a stateless way to do this? It's difficult to follow the denotational semantics
          //of the code given a stateful variable like this.
          searchIndex++;
          return tmpMatch;
        })
      : source;
  return { results, replaced };
}

export default findr
