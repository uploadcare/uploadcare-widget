/* @flow */

/**
 * Removes duplicates from array
 *
 * @export
 * @param {Array<T>} arr
 * @returns {Array<T>}
 */
export function unique<T>(arr: Array<T>): Array<T> {
  return [...new Set(arr)]
}
