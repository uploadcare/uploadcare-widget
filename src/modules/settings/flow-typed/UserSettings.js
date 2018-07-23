/* @flow */

export type UserSettings = {
  // developer hooks
  live: any,
  manualStart: any,
  locale: any,
  // widget & dialog settings
  systemDialog: any,
  crop: any,
  previewStep: any,
  imagesOnly: any,
  clearable: any,
  multiple: any,
  multipleMax: any,
  multipleMin: any,
  multipleMaxStrict: any,
  imageShrink: any,
  tabs: any,
  preferredTypes: any,
  inputAcceptTypes: any,
  // upload settings
  doNotStore: any,
  publicKey: any,
  secureSignature: any,
  secureExpire: any,
  pusherKey: any,
  cdnBase: any,
  urlBase: any,
  socialBase: any,
  previewProxy: any,
  previewUrlCallback: any,
  // fine tuning
  imagePreviewMaxSize: any,
  multipartMinSize: any,
  multipartPartSize: any,
  multipartMinLastPartSize: any,
  multipartConcurrency: any,
  multipartMaxAttempts: any,
  parallelDirectUploads: any,
  passWindowOpen: any,
  // maintain settings
  scriptBase: any,
  debugUploads: any,
  integration: any,
}
