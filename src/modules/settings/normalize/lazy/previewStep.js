/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'
import type {Settings} from '../../flow-typed/Settings'

export const previewStep: ValueTransformer<boolean, Settings> = (value: boolean, settings: Settings) => {
  return settings.crop || settings.multiple ? true : value
}
