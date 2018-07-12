/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const map: (a: any, b: any) => ValueTransformer<any> = (a: any, b: any) => (value: any) =>
  value === a ? b : value
