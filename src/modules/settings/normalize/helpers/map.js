/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

/**
 * Maps value of `a` to the value of `b`
 *
 * @export
 * @template T
 * @param {T} a
 * @param {T} b
 * @returns {ValueTransformer<T>}
 */
export function map<T>(a: T, b: T): ValueTransformer<T, T> {
  return (value: T) => (value === a ? b : value)
}
