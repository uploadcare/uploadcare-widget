/* @flow */
import type {UserSettings} from '../../flow-typed/UserSettings'
import type {Settings} from '../../flow-typed/Settings'

export type ValueTransformer<T, S = ?Settings | ?UserSettings> = (value: any, settings: S) => T