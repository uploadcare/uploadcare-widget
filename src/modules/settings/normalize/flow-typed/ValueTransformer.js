/* @flow */

export type ValueTransformer<T, S = {}> = (value: any, settings: S) => T
