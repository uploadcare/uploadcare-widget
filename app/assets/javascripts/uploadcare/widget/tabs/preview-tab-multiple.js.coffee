{
  namespace,
  utils,
  ui: {progress},
  templates: {tpl},
  jQuery: $,
  locale: {t}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->

  class ns.PreviewTabMultiple extends ns.BasePreviewTab

    constructor: ->
      super

      @container.append(tpl('tab-preview-multiple'))
      @__fileTpl = $(tpl('tab-preview-multiple-file'))

      @fileListEl = @container.find('.uploadcare-file-list')
      @titleEl = @__find('title')
      @mobileTitleEl = @__find('mobile-title')
      @footerTextEl = @__find('footer-text')
      @doneBtnEl = @container.find('.uploadcare-dialog-preview-done')

      $.each @dialogApi.fileColl.get(), (i, file) =>
        @__fileAdded(file)
      @__updateContainerView()

      @dialogApi.fileColl.onAdd.add(@__fileAdded, @__updateContainerView)
      @dialogApi.fileColl.onRemove.add(@__fileRemoved, @__updateContainerView)
      @dialogApi.fileColl.onReplace.add(@__fileReplaced, @__updateContainerView)

      @dialogApi.fileColl.onAnyDone(@__fileDone)
      @dialogApi.fileColl.onAnyFail(@__fileFailed)
      @dialogApi.fileColl.onAnyProgress(@__fileProgress)

      @fileListEl.addClass(
        if @settings.imagesOnly
        then 'uploadcare-file-list_tiles'
        else 'uploadcare-file-list_table'
      )

      @__setupSorting()

    __setupSorting: ->
      @fileListEl.uploadcareSortable(
        touch: false
        axis: if @settings.imagesOnly then 'xy' else 'y'
        start: (info) ->
          info.dragged.css('visibility', 'hidden')
        finish: (info) =>
          info.dragged.css('visibility', 'visible')
          elements = @container.find('.uploadcare-file-item')
          index = (file) =>
            elements.index(@__fileToEl(file))
          @dialogApi.fileColl.sort (a, b) ->
            index(a) - index(b)
      )

    __find: (s, context = @container) ->
      # dpm — abbreviation of dialog-preview-multiple
      $('.uploadcare-dpm-' + s, context)

    __updateContainerView: =>
      files = @dialogApi.fileColl.length()
      tooManyFiles = @settings.multipleMax != 0 and files > @settings.multipleMax
      tooFewFiles = files < @settings.multipleMin

      @doneBtnEl.toggleClass('uploadcare-disabled-el', tooManyFiles or tooFewFiles)

      title = t('dialog.tabs.preview.multiple.title')
        .replace('%files%', t('file', files))
      @titleEl.text(title)

      footer = if tooManyFiles
        t('dialog.tabs.preview.multiple.tooManyFiles')
          .replace('%max%', @settings.multipleMax)
      else if files and tooFewFiles
        t('dialog.tabs.preview.multiple.tooFewFiles')
          .replace('%min%', @settings.multipleMin)
          .replace('%files%', t('file', files))
      else
        t('dialog.tabs.preview.multiple.question')

      @footerTextEl
        .toggleClass('uploadcare-error', tooManyFiles or tooFewFiles)
        .text(footer)

      @mobileTitleEl
        .toggleClass('uploadcare-error', tooManyFiles or tooFewFiles)
        .text(if tooManyFiles or tooFewFiles then footer else title)

    __updateFileInfo: (fileEl, info) ->
      fileEl.find('.uploadcare-file-item__name')
        .text(info.name or t('dialog.tabs.preview.unknownName'))

      fileEl.find('.uploadcare-file-item__size')
        .text(utils.readableFileSize(info.size, '–'))

    __fileProgress: (file, progressInfo) =>
      fileEl = @__fileToEl(file)

      fileEl.find('.uploadcare-progressbar__value')
        .css('width', Math.round(progressInfo.progress * 100) + '%')

      @__updateFileInfo(fileEl, progressInfo.incompleteFileInfo)

    __fileDone: (file, info) =>
      fileEl = @__fileToEl(file)
        .removeClass('uploadcare-file-item_uploading')
        .addClass('uploadcare-file-item_uploaded')

      fileEl.find('.uploadcare-progressbar__value')
        .css('width', '100%')
      @__updateFileInfo(fileEl, info)

      if info.isImage
        cdnURL = "#{info.cdnUrl}-/quality/lightest/" +
          if @settings.imagesOnly
          then "-/preview/340x340/"
          else "-/scale_crop/110x110/center/"
        fileEl.find('.uploadcare-file-item__preview')
          .addClass('uploadcare-zoomable-icon')
          .html(
            $('<img>').attr('src', cdnURL)
          ).on 'click', =>
            uploadcare.openPreviewDialog(file, @settings)
              .done (newFile) =>
                @dialogApi.fileColl.replace(file, newFile)

    __fileFailed: (file, error, info) =>
      @__fileToEl(file)
        .removeClass('uploadcare-file-item_uploading')
        .addClass('uploadcare-file-item_error')
        .find('.uploadcare-file-item__error')
          .text(t("errors.#{error}"))

    __fileAdded: (file) =>
      fileEl = @__createFileEl(file)
      fileEl.appendTo(@fileListEl)

    __fileRemoved: (file) =>
      @__fileToEl(file).remove()
      $(file).removeData()

    __fileReplaced: (oldFile, newFile) =>
      fileEl = @__createFileEl(newFile)
      fileEl.insertAfter(@__fileToEl(oldFile))
      @__fileRemoved(oldFile)

    __fileToEl: (file) ->
      # File can be removed before.
      $(file).data('dpm-el') or $()

    __createFileEl: (file) ->
      fileEl = @__fileTpl.clone()
        .on 'click', '.uploadcare-remove', =>
          @dialogApi.fileColl.remove(file)
      $(file).data('dpm-el', fileEl)
      fileEl
