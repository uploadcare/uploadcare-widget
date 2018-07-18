/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const integration: ValueTransformer<string, string> = (value: string) => {
  if (value) {
    return value
  }

  // TODO: get integration from script tag
  const integration = ''

  return integration
}
