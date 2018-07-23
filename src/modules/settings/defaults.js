/* @flow */

import type {UserSettings} from './flow-typed/UserSettings'

export const allTabs =
  'file camera url facebook gdrive gphotos dropbox instagram evernote flickr skydrive box vk huddle'

export const defaults: UserSettings = {
  // developer hooks
  live: true,
  manualStart: false,
  locale: 'en',
  // widget & dialog settings
  systemDialog: false,
  crop: false,
  previewStep: false,
  imagesOnly: false,
  clearable: false,
  multiple: false,
  multipleMax: 1000,
  multipleMin: 1,
  multipleMaxStrict: false,
  imageShrink: false,
  tabs: 'file camera url facebook gdrive gphotos dropbox instagram evernote flickr skydrive',
  preferredTypes: null,
  inputAcceptTypes: null, // '' means default, null means "disable accept"
  // upload settings
  doNotStore: false,
  publicKey: null,
  secureSignature: null,
  secureExpire: null,
  pusherKey: '79ae88bd931ea68464d9',
  cdnBase: 'https://ucarecdn.com',
  urlBase: 'https://upload.uploadcare.com',
  socialBase: 'https://social.uploadcare.com',
  previewProxy: null,
  previewUrlCallback: null,
  // fine tuning
  imagePreviewMaxSize: 25 * 1024 * 1024,
  multipartMinSize: 25 * 1024 * 1024,
  multipartPartSize: 5 * 1024 * 1024,
  multipartMinLastPartSize: 1024 * 1024,
  multipartConcurrency: 4,
  multipartMaxAttempts: 3,
  parallelDirectUploads: 10,
  passWindowOpen: false,
  // maintain settings
  scriptBase: '//ucarecdn.com/widget/#{uploadcare.version}/uploadcare/',
  debugUploads: false,
  integration: null,
}
