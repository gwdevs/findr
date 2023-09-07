import * as F from 'fast-check'

/**
Get the difference between two sets

@example setDiff(new Set([1,2]), new Set([1])) == new Set([2])
@internal
*/
const setDiff = <A>(a : Set<A>, b : Set<A>) : Set<A> => new Set([...a].filter(x => !b.has(x)))

/**
The entire alphabet of stringable characters
@internal
*/
const alphabet = () : Set<string> => new Set([...new Array(0x7e-0x20+1)].map(x => String.fromCharCode(x+0x20)))

/**
Create an arbitrary string pulling only from the given array of characters
@internal
*/
const subStrOfChars = (chars : Array<string>, n : number) : F.Arbitrary<string> => 
  F.stringOf(F.constantFrom(...chars), {minLength: n, maxLength: n})
  
/**
Create a string (s) from a string (t) such that (s) has a length (n) and (t) is not found as a substring
anywhere in (s).
*/
export const nonSubStringOf = (s : string, n : number) : F.Arbitrary<string> => 
    s.length === 0 ? F.asciiString({minLength: n, maxLength: n})
  : subStrOfChars(Array.from(setDiff(alphabet(), new Set(s))), n)
