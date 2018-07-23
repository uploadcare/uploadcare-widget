/* @flow */

import type {PreviewUrlCallback} from '../../flow-typed/Settings'

type DefaultPreviewUrlCallback = (previewProxy: string) => PreviewUrlCallback

export const defaultPreviewUrlCallback: DefaultPreviewUrlCallback = (previewProxy: string) => (originalUrl: string) => {
  const addQuery = !(/\?/).test(previewProxy)
  const addName = addQuery || !(/\=$/).test(previewProxy)
  const addAmpersand = !addQuery && !(/[\&\?\=]$/).test(previewProxy)

  const prependIf = (cond: boolean, prepend: string, to: string) => (cond ? prepend + to : to)
  let queryPart = encodeURIComponent(originalUrl)

  queryPart = prependIf(addName, 'url=', queryPart)
  queryPart = prependIf(addAmpersand, '&', queryPart)
  queryPart = prependIf(addQuery, '?', queryPart)

  return previewProxy + queryPart
}
