/* @flow */

import type {ValueTransformer} from './ValueTransformer'

export type PrepareTransforms = {[key: string]: Array<ValueTransformer<any>>}
export type LazyTransforms = {[key: string]: ValueTransformer<any>}

export type Schema = {
  prepare: PrepareTransforms,
  lazy: LazyTransforms,
}
