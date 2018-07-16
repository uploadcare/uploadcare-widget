/* @flow */

import {schema as defaultSchema} from './schema'

import type {UserSettings} from '../flow-typed/UserSettings'
import type {Settings} from '../flow-typed/Settings.js'
import type {ValueTransformer} from './flow-typed/ValueTransformer'
import type {Schema, Transformations} from './flow-typed/Schema'
import type {ComposingOptions} from './flow-typed/ComposingOptions'

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

  keys.reduce(
    reduceSettings < UserSettings > (schema.stage0, {
      stopOnEmpty: true,
      passSettings: false,
    }),
    shallowCopy
  )
  keys.reduce(
    reduceSettings < Settings > (schema.stage1, {
      stopOnEmpty: false,
      passSettings: true,
    }),
    shallowCopy
  )

  return shallowCopy
}

/**
 * Create reducer that applies transforms to the whole settings object
 *
 * @param {Transformations} transformations Settings keys and it's reducers
 * @param {ComposingOptions} options Composing options
 * @returns {(acc: T, key: string) => $ObjMap<T, () => any>} Settings object reducer
 */
function reduceSettings<T: {}>(
  transformations: Transformations,
  options: ComposingOptions
): (acc: T, key: string) => $ObjMap<T, () => any> {
  return (acc: T, key: string) => {
    if (!transformations || !transformations[key]) {
      return acc
    }

    const valueTransformations = transformations[key]
    const value = reduceValue(key, acc, valueTransformations, options)

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
 * @param {ComposingOptions} options Composing options
 * @returns {*} A value returned by last reducer
 */
function reduceValue(
  key: string,
  settings: $Shape<Settings>,
  transformations: Array<ValueTransformer<any>>,
  options: ComposingOptions
): any {
  return transformations.reduce((result: any, fn: ValueTransformer<any, any>) => {
    if (options.stopOnEmpty && (typeof result === 'undefined' || result === null)) {
      return result
    }

    return fn(result, options.passSettings ? settings : undefined)
  }, settings[key])
}
