/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

/**
 * Constraint number value from the min limit to the max limit
 *
 * @export
 * @param {number} min
 * @param {number} max
 * @returns {ValueTransformer<number, number>}
 */
export function constrain(min: number, max: number): ValueTransformer<number, number> {
  return (value: number) => Math.min(Math.max(value, min), max)
}
