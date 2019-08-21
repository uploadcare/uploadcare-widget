import dialog './templates/dialog.jst.ejs'
import dialogPanel './templates/dialog__panel.jst.ejs'
import icons './templates/icons.jst.ejs'
import progressText './templates/progress__text.jst.ejs'
import styles './templates/styles.jst.ejs'
import tabCameraCapture './templates/tab-camera-capture.jst.ejs'
import tabCamera './templates/tab-camera.jst.ejs'
import tabFle './templates/tab-file.jst.ejs'
import tabPreviewError './templates/tab-preview-error.jst.ejs'
import tabPreviewImage './templates/tab-preview-image.jst.ejs'
import tabPreviewMultipleFile './templates/tab-preview-multiple-file.jst.ejs'
import tabPreviewMultiple './templates/tab-preview-multiple.jst.ejs'
import tabPreviewRegular './templates/tab-preview-regular.jst.ejs'
import tabPreviewUnknown './templates/tab-preview-unknown.jst.ejs'
import tabPreviewVideo './templates/tab-preview-video.jst.ejs'
import tabUrl './templates/tab-url.jst.ejs'
import widgetButton './templates/widget-button.jst.ejs'
import widgetFileName './templates/widget-file-name.jst.ejs'
import widget './templates/widget.jst.ejs'

{
  locale,
  utils,
  jQuery: $,
} = uploadcare

uploadcare.namespace 'templates', (ns) ->
  ns.JST = {
    'dialog': dialog
    'dialog__panel': dialogPanel
    # 'icons': icons
    'progress__text': progressText
    # 'styles': styles
    'tab-camera-capture': tabCameraCapture
    'tab-camera': tabCamera
    'tab-file': tabFle
    'tab-preview-error': tabPreviewError
    'tab-preview-image': tabPreviewImage
    'tab-preview-multiple-file': tabPreviewMultipleFile
    'tab-preview-multiple': tabPreviewMultiple
    'tab-preview-regular': tabPreviewRegular
    'tab-preview-unknown': tabPreviewUnknown
    'tab-preview-video': tabPreviewVideo
    'tab-url': tabUrl
    'widget-button': widgetButton
    'widget-file-name': widgetFileName
    'widget': widget
  }

  ns.tpl = (key, ctx={}) ->
    fn = ns.JST[key]
    if fn?
      fn($.extend({t: locale.t, utils, uploadcare}, ctx))
    else
      ''
