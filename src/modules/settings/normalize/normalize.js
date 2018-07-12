/* @flow */

import {schema as defaultSchema} from './schema'

import type {UserSettings} from '../flow-typed/UserSettings'
import type {Settings} from '../flow-typed/Settings.js'
import type {ValueTransformer} from './flow-typed/ValueTransformer'
import type {Schema, PrepareTransforms, LazyTransforms} from './flow-typed/Schema'

/**
 * Normalize user passed settings
 *
 * @export
 * @param {UserSettings} userSettings Input settings object
 * @param {Schema} [schema=defaultSchema] Schema of settings processing
 * @returns {Settings} Transformed output settings
 */
export function normalize(userSettings: UserSettings, schema?: Schema = defaultSchema): Settings {
  const shallowCopy = {...userSettings}
  const keys = Object.keys(shallowCopy)

  keys.reduce(reduceSettings < UserSettings > (schema.prepare, true), shallowCopy)
  keys.reduce(reduceSettings < Settings > (schema.lazy, false), shallowCopy)

  return shallowCopy
}

/**
 * Create reducer that applies transforms to the whole settings object
 *
 * @param {(PrepareTransforms | LazyTransforms)} transformsMap Settings keys and it's reducers
 * @param {boolean} stopOnFalsy Do not call next reducer if value is null or undefined
 * @returns {(acc: T, key: string) => $ObjMap<T, () => any>} Settings object reducer
 */
function reduceSettings<T: {}>(
  transformsMap: PrepareTransforms | LazyTransforms,
  stopOnFalsy: boolean
): (acc: T, key: string) => $ObjMap<T, () => any> {
  return (acc: T, key: string) => {
    if (!transformsMap || !transformsMap[key]) {
      return acc
    }

    const transforms = Array.isArray(transformsMap[key]) ? transformsMap[key] : [transformsMap[key]]
    const value = reduceValue(key, acc, transforms, stopOnFalsy)

    acc[key] = value

    return acc
  }
}

/**
 * Apply a set of transformers (reducers) to a value of settings property
 *
 * @param {string} key Key of settings property
 * @param {$Shape<Settings>} settings Settings object
 * @param {Array<ValueTransformer<any>>} transforms Array of transformers
 * @param {boolean} stopOnFalsy Do not call next reducer if value is null or undefined
 * @returns {*} A value returned by last reducer
 */
function reduceValue(
  key: string,
  settings: $Shape<Settings>,
  transforms: Array<ValueTransformer<any>>,
  stopOnFalsy: boolean
): any {
  return transforms.reduce((result: any, fn: ValueTransformer<any>) => {
    if (stopOnFalsy && (typeof result === 'undefined' || result === null)) {
      return result
    }

    return fn(result, settings)
  }, settings[key])
}
