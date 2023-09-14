/**
@module

This is used to generate the initial data set for the gold-master
test of the legacy findr API. Once the new API is out we can delete
this file
*/

import * as T from './FindrTypes.d'
import * as F from 'fast-check'
import {expect, describe, test} from '@jest/globals'
import fnr from './index'
import {readFile, writeFile} from 'fs/promises'

const replacementCallback : F.Arbitrary<T.replacementCallback> = F.func(F.string())

const resultsAll : F.Arbitrary<'all'> = F.constant('all')

const resultKeybuilder : F.Arbitrary<(index: number) => T.resultKey> =
  F.oneof
    ( F.constant((i : number) => String(i))
    , F.constant((x: number) => x)
    )

const filter : F.Arbitrary<(s: string) => string> = F.constant((x : string) => x)

/**
  generates random config for findr. 

  NOTE: we're not generating regular expressions so config related to
  that has not been included.
*/
const findrConfig : F.Arbitrary<T.FindrConfig> = F.record
  ({ctxLen              : F.nat()
  , filterCtxMatch      : filter
  , filterCtxReplacement: filter
  , buildResultKey      : resultKeybuilder
  , isCaseMatched       : F.boolean()
  , isWordMatched       : F.boolean()
  , isCasePreserved     : F.boolean()
  }
  , {requiredKeys : []}
  )

/**
  Generates random FindrParams to use for the goldmaster testing.
*/
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


/**
  @todo pnpm requires this to be a path relative to the root of the
  repository.  I'm not a fan of it but I'm not sure where else to
  place this file.
*/
const goldMasterFileName = './packages/fnr-text/src/lib/legacyGoldMaster.json'

/**
  @description Generates the JSON file for performing a goldmaster testing on the
  legacy findr API.
*/
export const writeGoldMasterJSONFile = () =>
  writeFile
    ( goldMasterFileName
    , JSON.stringify(F.sample(searchAndReplace).map(param => ({ param, result: fnr(param)})), null, 2)
    )

/**
  @description perform Goldmaster testing

  Gold-master testing is a way to test an API to ensure that
  it is fully backwards compatible with older versions of the API.

  In short here's how it works.
    0. start with the old API (in ourcase this will be the `fnr` function
    _before_ the refactor since that's the  API who's version we want to
    preserve)
    1. generate a large enough random set of inputs and pass them into
    the API.
    2. Record each pair of input/output (this is what the legacyGoldMaster.json
    file is for)
    3. Whenever the API is updated (aka, we refactor the `fnr` function) apply
    all of the inputs to the API and ensure the outputs didn't change.
  @see https://en.wikipedia.org/wiki/Characterization_test
*/
export const goldMasterTest = () =>
  readFile(goldMasterFileName, { encoding: 'utf8' })
  .then(JSON.parse)
  .then(legacyGoldMasterData => 
    describe('gold-master', () => test.each(legacyGoldMasterData)
      ('gold master test on: (%j)', (param : any, result) => { expect(fnr(param)).toEqual(result) })
  ))
