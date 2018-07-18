/* @flow */

import type {ValueTransformer} from './ValueTransformer'

export type Transformations = {[key: string]: Array<ValueTransformer<mixed, mixed>>}

export type Schema = {
  stage0: Transformations,
  stage1: Transformations,
}
