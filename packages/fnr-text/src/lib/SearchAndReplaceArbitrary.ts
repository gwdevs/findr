/**
@module

This is used to generate the initial data set for the gold-master
test of the legacy findr API. Once the new API is out we can delete
this file
*/

/**
  @todo CHRIS:
   Since we are importing from a index file, I don't really know what T is
   supposed to be. Single-character variables usually take my brain a few
   seconds longer usually though.

  Noah:
    So `T` here stands for `Types`. The reason I use a single character is
    to reduce visual noise in the code. Consider the alternative in the following
    example:

    `FastCheck.Arbitrary<FnrTypes.replacementCallback>`

    To what I currently have:

    `F.Arbitrary<T.replacementCallback>`

    For me the signal to noise ratio is lower in the second example. 
    What's your opinion?
 */
import * as T from './index.d'
import * as F from 'fast-check'
import fnr from './index'

// import XRegeExp from 'xregexp/types'

// const regExp : F.Arbitrary<RegExp> = F.constant(F)

// declare const xregexp : F.Arbitrary<typeof XRegeExp>

/**
  @todo CHRIS:
   Same as earlier I don't understand all that this is doing since I haven't
   used property-based testing
 */

const replacementCallback : F.Arbitrary<T.replacementCallback> = F.func(F.string())

const resultsAll : F.Arbitrary<'all'> = F.constant('all')

const resultKeybuilder : F.Arbitrary<(index: number) => T.resultKey> =
  F.oneof
    ( F.constant((i : number) => String(i))
    , F.constant((x: number) => x)
    )

const filter : F.Arbitrary<(s: string) => string> = F.constant((x : string) => x)

const findrConfig : F.Arbitrary<T.FindrConfig> = F.record
  ({ctxLen              : F.nat()
  , filterCtxMatch      : filter
  , filterCtxReplacement: filter
  , buildResultKey      : resultKeybuilder
  // xregexp            : xregexp
  //, isRegex           : F.boolean()
  , isCaseMatched       : F.boolean()
  , isWordMatched       : F.boolean()
  , isCasePreserved     : F.boolean()
  }
  , {requiredKeys : []}
  )

export const searchAndReplace : F.Arbitrary<T.FindrParams> = F.record
  ({source          : F.string()
  , target          : F.string()
  , replacement     : F.oneof(F.string(), replacementCallback)
  , contextLength   : F.nat()
  , replacementKeys : F.oneof(F.array(F.oneof(F.string(), F.nat())), resultsAll)
  , config          : findrConfig
  , metadata        : F.option(F.object())
  }, {requiredKeys: ['source', 'target' ]}
  )

export const generateTestJSONString = () : string =>
  JSON.stringify(F.sample(searchAndReplace).map(param => ({ param, result: fnr(param)})), null, 2)
