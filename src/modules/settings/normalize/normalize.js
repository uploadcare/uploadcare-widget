/* @flow */

import {schema as defaultSchema} from './schema'
import {SettingsError} from 'errors/SettingsError'
import {filterByKeys} from 'util/filterByKeys'

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
  const shallowCopy = filterByKeys(Object.keys(schema.stage0), userSettings)
  const keys = Object.keys(shallowCopy)

  keys.reduce(
    reduceSettings < UserSettings > (schema.stage0, {
      stopOnEmpty: true,
      passSettings: false,
    }),
    shallowCopy
  )
  keys.reduce(
    reduceSettings < Settings > (schema.stage1 || {}, {
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
 * @template T
 * @param {Transformations} transformations Settings keys and it's reducers
 * @param {ComposingOptions} options Composing options
 * @returns {(acc: T, key: string) => $ObjMap<T, ValueTransformer<mixed, any>>} Settings reducer
 */
function reduceSettings<T: {}>(
  transformations: Transformations,
  options: ComposingOptions
): (acc: T, key: string) => $ObjMap<T, ValueTransformer<mixed, any>> {
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
 * @template R
 * @param {string} key Key of settings property
 * @param {$Shape<Settings>} settings Settings object
 * @param {Array<ValueTransformer<mixed, R>>} transforms Array of transformers
 * @param {ComposingOptions} options Composing options
 * @returns {R} A value returned by last reducer
 */
function reduceValue<R: any>(
  key: string,
  settings: $Shape<Settings>,
  transformations: Array<ValueTransformer<mixed, R>>,
  options: ComposingOptions
): R {
  return transformations.reduce((result: R, fn: ValueTransformer<mixed, R>) => {
    if (options.stopOnEmpty && (typeof result === 'undefined' || result === null)) {
      return result
    }

    try {
      return fn(result, options.passSettings ? settings : undefined)
    }
    catch (error) {
      return handleError(key, result, error)
    }
  }, settings[key])
}

/**
 * Handle error while processing option
 * Prints warning to the user's console
 *
 * @param {string} key
 * @param {mixed} value
 * @param {Error} error
 * @returns
 */
function handleError(key: string, value: mixed, error: Error) {
  if (error instanceof SettingsError) {
    /* eslint-disable no-console */
    console.error(
      `Failed to process option "${key}" with error "${error.message}". Got value: ${
        typeof value === 'string' ? `"${value}"` : ''
      }`,
      typeof value === 'string' ? '' : value
    )
    /* eslint-enable no-console */

    return error.returnValue
  }

  throw error
}
