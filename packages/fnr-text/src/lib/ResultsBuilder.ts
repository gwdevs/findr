import { SearchResult } from './index.d';

//TODO: merge this with the CaseHandler type
type SearchIndex = number

type ResultsBuilder<A> = (results: SearchResult[], searchIndex : SearchIndex) => A;

/** 
 * CHRIS:
 *   In general, I see you using pure, andThen, andNext.
 *   Out of curiosity, what is the reason? What are they for?
 *   I'm new to type practices and such, or maybe its a FP thing
 */
export const pure = <A>(a : A) : ResultsBuilder<A> => () => a

export const andThen = <A,B>(a : ResultsBuilder<A>, f : (a : A) => ResultsBuilder<B>) : ResultsBuilder<B> => (r, i) =>
  f(a(r,i))(r,i)

export const andNext = <A,B>(a : ResultsBuilder<A>, b : ResultsBuilder<B>) : ResultsBuilder<B> => (r,i) => {
  a(r,i)
  return b(r,i)
}

export const searchIndex : ResultsBuilder<SearchIndex> = (_,i) => i

export const incrementSearchIndex : ResultsBuilder<null> = (_,i) => {i++; return null}

export const addSearchResult = (newResult : SearchResult) : ResultsBuilder<null> => (r,_) => {r.push(newResult); return null}

/**
 * CHRIS:
 *   Being unfamiliar with these functions, how should I read this?
 */
export const replaceAndResult = (s : string, r : SearchResult) : ResultsBuilder<string> => 
  andNext(andNext(incrementSearchIndex, addSearchResult(r)),  pure(s))  

export const map = <A,B>(a : ResultsBuilder<A>, f : (A : A) => B) : ResultsBuilder<B> => (r,i) => 
  f(a(r,i))

export const ifElse  = <A>(predicate : ResultsBuilder<boolean>, a : ResultsBuilder<A>, b : ResultsBuilder<A>) : ResultsBuilder<A> => (r,i) =>
  predicate(r,i) ? a(r,i) : b(r,i) 
