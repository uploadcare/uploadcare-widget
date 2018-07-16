/* @flow */

import type {ValueTransformer} from './ValueTransformer'

export type Transformations = {[key: string]: Array<ValueTransformer<any>>}

export type Schema = {
  stage0: Transformations,
  stage1: Transformations,
}
