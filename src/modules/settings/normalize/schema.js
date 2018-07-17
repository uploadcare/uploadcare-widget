/* @flow */

import type {Schema} from './flow-typed/Schema'

import * as cast from './cast'
import * as custom from './custom'
import * as helpers from './helpers'
import * as lazy from './lazy'

import {defaults, allTabs} from '../defaults'

export const schema: Schema = {
  /*
   * The first stage of settings transformation
   * Reducers are composed from left to right
   * If value is null or undefined, then composing stops
   * This stage should be used for initial transformations
   * i.e. type casting, value mapping, constraints, formatting
   * Reducers can't depend on other fields and should be pure function of value
   */
  stage0: {
    live: [cast.boolean],
    manualStart: [cast.boolean],
    locale: [cast.string],
    systemDialog: [cast.boolean],
    crop: [custom.crop],
    previewStep: [cast.boolean],
    imagesOnly: [cast.boolean],
    clearable: [cast.boolean],
    multiple: [cast.boolean],
    multipleMax: [cast.int, helpers.map(0, 1000), helpers.constrain(1, 1000)],
    multipleMin: [cast.int],
    multipleMaxStrict: [cast.boolean],
    imageShrink: [cast.string, custom.imageShrink],
    tabs: [cast.string, helpers.map('all', allTabs), helpers.map('default', defaults.tabs), cast.array],
    preferredTypes: [cast.array],
    inputAcceptTypes: [cast.string],
    doNotStore: [cast.boolean],
    publicKey: [cast.string, custom.publicKey],
    secureSignature: [cast.string],
    secureExpire: [cast.string],
    pusherKey: [cast.string],
    cdnBase: [cast.string, helpers.url],
    urlBase: [cast.string, helpers.url],
    socialBase: [cast.string, helpers.url],
    previewProxy: [cast.string, helpers.url],
    previewUrlCallback: [cast.func],
    imagePreviewMaxSize: [cast.int],
    multipartMinSize: [cast.int],
    multipartPartSize: [cast.int],
    multipartMinLastPartSize: [cast.int],
    multipartConcurrency: [cast.int],
    multipartMaxAttempts: [cast.int],
    parallelDirectUploads: [cast.int],
    passWindowOpen: [cast.boolean],
    scriptBase: [cast.string, helpers.url],
    debugUploads: [cast.boolean],
    integration: [cast.string],
  },
  /*
   * The second stage of settings transformation
   * Composing never stops
   * Settings object is passed as second parameter
   * This stage should be used to maketransformations
   * depending on other fields or some external providers
   */
  stage1: {
    previewStep: [lazy.previewStep],
    systemDialog: [lazy.systemDialog],
    previewUrlCallback: [lazy.previewUrlCallback],
    integration: [lazy.integration],
  },
}
