/* @flow */

import type {ValueTransformer} from './ValueTransformer'

export type Transformations = {[key: string]: Array<ValueTransformer<any>>}

export type Schema = {
  prepare: Transformations,
  lazy: Transformations,
}
