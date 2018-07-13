/* @flow */

import type {Schema} from './flow-typed/Schema'

import * as cast from './cast'
import * as custom from './custom'
import * as lazy from './lazy'

import {defaults, allTabs} from '../defaults'

export const schema: Schema = {
  prepare: {
    live: [cast.boolean],
    manualStart: [cast.boolean],
    locale: [cast.string],
    systemDialog: [cast.boolean],
    crop: [custom.crop],
    previewStep: [cast.boolean],
    imagesOnly: [cast.boolean],
    clearable: [cast.boolean],
    multiple: [cast.boolean],
    multipleMax: [cast.int, custom.map(0, 1000), custom.constrain(1, 1000)],
    multipleMin: [cast.int],
    multipleMaxStrict: [cast.boolean],
    imageShrink: [cast.string, custom.imageShrink],
    tabs: [cast.string, custom.map('all', allTabs), custom.map('default', defaults.tabs), cast.array],
    preferredTypes: [cast.array],
    inputAcceptTypes: [cast.array],
    doNotStore: [cast.boolean],
    publicKey: [cast.string],
    secureSignature: [cast.string],
    secureExpire: [cast.string],
    pusherKey: [cast.string],
    cdnBase: [cast.string, custom.url],
    urlBase: [cast.string, custom.url],
    socialBase: [cast.string, custom.url],
    previewProxy: [cast.string, custom.url],
    previewUrlCallback: [cast.func],
    imagePreviewMaxSize: [cast.int],
    multipartMinSize: [cast.int],
    multipartPartSize: [cast.int],
    multipartMinLastPartSize: [cast.int],
    multipartConcurrency: [cast.int],
    multipartMaxAttempts: [cast.int],
    parallelDirectUploads: [cast.int],
    passWindowOpen: [cast.boolean],
    scriptBase: [cast.string, custom.url],
    debugUploads: [cast.boolean],
    integration: [cast.string],
  },
  lazy: {
    previewStep: lazy.previewStep,
    systemDialog: lazy.systemDialog,
    previewUrlCallback: lazy.previewUrlCallback,
  },
}
