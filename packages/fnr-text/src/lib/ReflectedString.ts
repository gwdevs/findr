import {Monoid, fold} from './Monoid'
import * as F from 'fast-check'

type UppercaseChar = string
type LowercaseChar = string

type ReflectedChar = [UppercaseChar, LowercaseChar]

type UppercaseString = string
type LowercaseString = string

/**
A reflected string is a pair of non-empty strings each made only of letters a-zA-Z. Each string
in the pair is identical, however the casing of letters are opposite each other.

@example
  ["AbC", "aBc"]
*/
export type ReflectedString = [UppercaseString, LowercaseString]

export const monoid : Monoid<ReflectedString> = 
  { merge : ([a,b], [c,d]) =>  [a+c, b+d]
  , empty : () => ["", ""]
  }

const reflectedCaseLetter = () : F.Arbitrary<ReflectedChar> => 
  F.boolean().chain(shouldSwapCase => 
    F.mapToConstant
      ({ num: 26
      , build: v => shouldSwapCase ? 
            [String.fromCharCode(v + 0x41), String.fromCharCode(v + 0x61)] 
          : [String.fromCharCode(v + 0x61), String.fromCharCode(v + 0x41)]
      })
  )

export const reflectedString = () : F.Arbitrary<ReflectedString> => 
  F.array(reflectedCaseLetter(), {minLength: 1}).map(fold(monoid)) 