/* @flow */

export type CropSettings = {|
  downscale: boolean,
  upscale: boolean,
  notLess: boolean,
  preferedSize: [number, number],
|}

export type ImageShrinkSettings = {|
  quality: number | null,
  size: number,
|}

export type PreviewUrlCallback = (originalUrl: string, fileInfo: {}) => string

export type Settings = {
  // developer hooks
  live: ?boolean,
  manualStart: ?boolean,
  locale: ?string,
  localePluralize: ?string,
  localeTranslations: ?string,
  // widget & dialog settings
  systemDialog: ?boolean,
  crop: false | Array<CropSettings>,
  previewStep: boolean,
  imagesOnly: ?boolean,
  clearable: ?boolean,
  multiple: boolean,
  multipleMax: ?number,
  multipleMin: ?number,
  multipleMaxStrict: ?boolean,
  imageShrink: false | ImageShrinkSettings,
  pathValue: ?boolean,
  tabs: ?string,
  preferredTypes: ?string,
  inputAcceptTypes: ?string,
  // upload settings
  doNotStore: ?boolean,
  publicKey: ?string,
  secureSignature: ?string,
  secureExpire: ?string,
  pusherKey: ?string,
  cdnBase: ?string,
  urlBase: ?string,
  socialBase: ?string,
  previewProxy: ?string,
  previewUrlCallback: ?PreviewUrlCallback,
  // fine tuning
  imagePreviewMaxSize: ?number,
  multipartMinSize: ?number,
  multipartPartSize: ?number,
  multipartMinLastPartSize: ?number,
  multipartConcurrency: ?number,
  multipartMaxAttempts: ?number,
  parallelDirectUploads: ?number,
  passWindowOpen: ?boolean,
  // maintain settings
  scriptBase: ?string,
  debugUploads: ?boolean,
  integration: ?string,
}
