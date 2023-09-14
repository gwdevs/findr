export type Parser<A,B> = (s : A) => B | null 

/**
 * CHRIS:
 *  These two functions are harder for me to understand.
 *  A good thing is the naming of the functions are good to help me understand
 *
 *  Could renaming the single letter variables p,q,a,b be helpful?
 *  I think f could remain since f for func is pretty universal.
 */
export const andThen : <A,B,C>(p : Parser<A,B>, q: Parser<B,C>) => Parser<A,C> = (p, q) => (a) => { 
  const b = p(a)
  return b === null ? null : q(b)  
}

export const withDefault : <A,B>(p : Parser<A,B>, f : (x: A) => B) => (a :A) => B = (p,f) => (a) => {
  const b = p(a)
  return b === null ? f(a) : b 
}
