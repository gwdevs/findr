/**
A monoid is a type A that has an empty value, and a binary operator `merge`.

@see https://en.wikipedia.org/wiki/Monoid
*/
export interface Monoid<A> 
  { merge : (a : A, b : A) => A
  , empty : () => A
  }    

export const foldMap = <A,B>({merge, empty}: Monoid<B>, f : (a : A) => B) => (xs : Array<A>) : B => 
  xs.reduce((b,a) => merge(b, f(a)), empty())

export const fold = <A>({merge, empty} : Monoid<A>) => (xs : Array<A>) : A => 
  xs.reduce((b,a) => merge(b,a), empty())  