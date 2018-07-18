/* @flow */
import type {UserSettings} from '../../flow-typed/UserSettings'
import type {Settings} from '../../flow-typed/Settings'

export type ValueTransformer<V, R, S = ?UserSettings | ?Settings> = (value: V, settings: S) => R
