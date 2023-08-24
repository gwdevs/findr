import * as P from './Parser'

export type Regexer = (source: string, flags? : string) => RegExp
export type RegexFlags = Array<string>;

export type SourceAndFlags = (regexer : Regexer, defFlags : RegexFlags) => RegExp 

export const global : RegexFlags = ['g'] 

export const caseInsensitive : RegexFlags = ['i'] 

export const  mergeFlags = (a: RegexFlags, b : RegexFlags) : RegexFlags => [...new Set([...a, ...b])]

export const  onlySource = (source : string) : SourceAndFlags => (regexer, defFlags) => regexer(source, defFlags.join(''))

export const  addFlags = (runRegexer : SourceAndFlags, flags : RegexFlags) : SourceAndFlags => (regexer, defFlags) =>  
    runRegexer(regexer, mergeFlags(flags, defFlags))
  
  //TODO: is this necessary? isRegex is typed to be a boolean. If users are
  //using TS this check is unecessary. If the users are using JS to consume this
  //library maybe we should think about a more generic way to enforce types at 
  //runtime?
  //TODO: remove isRegex from interface of findr
  /** is findr being used in regex mode */
  //TODO: isRegex : Bool -> (TargetString -> { source : string, flags: Flags})
  //rewrite isRegex to use 2 available function types
  /** regex gotten from findr's target input */
export const  fromRegex = (r : RegExp) : SourceAndFlags => onlySource(r.source)

export const  fromString = (s: string) : SourceAndFlags => onlySource(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))

export const  regexFromString : P.Parser<string, SourceAndFlags> = P.andThen 
    (s => s.match(/\/(.+)\/(?=(\w*$))/)
    , results => results?.length === 3 
        ? addFlags(onlySource(results[1]), [...results[2]])  
        : null 
    )

export const  regexStringToRegexer : (s : string) => SourceAndFlags = P.withDefault(regexFromString, fromString) 
