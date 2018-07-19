/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'
import type {PreviewUrlCallback, Settings} from '../../flow-typed/Settings'
import {defaultPreviewUrlCallback} from './defaultPreviewUrlCallback'

export const previewUrlCallback: ValueTransformer<?PreviewUrlCallback, ?PreviewUrlCallback, Settings> = (
  value: ?PreviewUrlCallback,
  settings: Settings
) => {
  if (settings.previewProxy && !settings.previewUrlCallback) {
    return defaultPreviewUrlCallback(settings.previewProxy)
  }

  return value
}
