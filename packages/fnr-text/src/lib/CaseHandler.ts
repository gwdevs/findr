type StringIndex = number
type SearchIndex = number

/**
 * CHRIS:
 *  What is the groups property? I can get my mind around the other properties
 */
export type SearchMatch = 
    { index: SearchIndex
    , match: string
    , groups: string[]
    , position: StringIndex
    , source : string
    , namedGroups? : object
    }

export type CaseHandler<A> = (match : SearchMatch) => A;

export const pure : <A>(a : A) => CaseHandler<A> = (s) => () => s  

export const andThen = <A,B>(a : CaseHandler<A>, f : (a : A) => CaseHandler<B>) => (m : SearchMatch) => 
    f(a(m))(m)

export const maintainCase = (replaced : string) : CaseHandler<string> => ({match}) => 
  String(match).toUpperCase() === match ? String(replaced).toUpperCase()
  : match[0].toUpperCase() ? `${replaced[0].toUpperCase()}${replaced.slice(1)}`
  : replaced;  
