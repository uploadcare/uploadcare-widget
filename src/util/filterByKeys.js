/* @flow */

/**
 * Filter object by keys
 *
 * @export
 * @param {Array<string>} keys Array of allowed keys
 * @param {T} obj Object to filter
 * @returns {$Shape<T>} Shallow copy with allowed keys only
 */
export function filterByKeys<T: {}>(keys: Array<string>, obj: T): $Shape<T> {
  return Object.keys(obj)
    .filter(key => keys.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key]

      return acc
    }, {})
}
