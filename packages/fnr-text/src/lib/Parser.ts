export type Parser<A,B> = (s : A) => B | null 

export const andThen : <A,B,C>(p : Parser<A,B>, q: Parser<B,C>) => Parser<A,C> = (p, q) => (a) => { 
  const b = p(a)
  return b === null ? null : q(b)  
}

export const withDefault : <A,B>(p : Parser<A,B>, f : (x: A) => B) => (a :A) => B = (p,f) => (a) => {
  const b = p(a)
  return b === null ? f(a) : b 
}
