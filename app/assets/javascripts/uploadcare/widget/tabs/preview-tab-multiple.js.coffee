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

    # dpm — abbreviation of dialog-preview-multiple
    CLASS_PREFIX = 'uploadcare-dpm-'

    constructor: ->
      super

      @container.append(tpl('tab-preview-multiple'))
      @__fileTpl = $(tpl('tab-preview-multiple-file'))

      @fileListEl = @__find('file-list')
      @titleEl = @__find('title')
      @mobileTitleEl = @__find('mobile-title')
      @footerTextEl = @__find('footer-text')
      @doneBtnEl = @container.find('.uploadcare-dialog-preview-done')

      $.each @dialogApi.fileColl.get(), (i, file) =>
        @__fileAdded(file)
        file.then(
          (info) => @__fileDone(file, info),
          (info) => @__fileFailed(file, info),
          (info) => @__fileProgress(file, info)
        )
      @__updateContainerView()

      @dialogApi.fileColl.onAdd.add(@__fileAdded, @__updateContainerView)
      @dialogApi.fileColl.onRemove.add(@__fileRemoved, @__updateContainerView)
      @dialogApi.fileColl.onReplace.add(@__fileReplaced, @__updateContainerView)

      @dialogApi.fileColl.onAnyDone.add(@__fileDone)
      @dialogApi.fileColl.onAnyFail.add(@__fileFailed)
      @dialogApi.fileColl.onAnyProgress.add(@__fileProgress)

      @__setupSorting()

    __setupSorting: ->
      @fileListEl.uploadcareSortable(
        touch: false
        axis: 'y'
        start: (info) ->
          info.dragged.css('visibility', 'hidden')
        finish: (info) =>
          info.dragged.css('visibility', 'visible')
          elements = @__find('file-item')
          index = (file) =>
            elements.index(@__fileToEl(file))
          @dialogApi.fileColl.sort (a, b) ->
            index(a) - index(b)
      )

    __find: (s, context = @container) ->
      $('.' + CLASS_PREFIX + s, context)

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
      @__find('file-name', fileEl)
        .text(info.name or t('dialog.tabs.preview.unknownName'))

      @__find('file-size', fileEl)
        .text(utils.readableFileSize(info.size, '–'))

    __fileProgress: (file, progressInfo) =>
      fileEl = @__fileToEl(file)

      @__find('file-progressbar-value', fileEl)
        .css('width', Math.round(progressInfo.progress * 100) + '%')

      @__updateFileInfo(fileEl, progressInfo.incompleteFileInfo)

    __fileDone: (file, info) =>
      fileEl = @__fileToEl(file)
      fileEl.addClass(CLASS_PREFIX + 'uploaded')

      @__find('file-progressbar-value', fileEl)
        .css('width', '100%')
      @__updateFileInfo(fileEl, info)

      if info.isImage
        @__find('file-preview-wrap', fileEl)
          .addClass('uploadcare-zoomable-icon')
          .html(
            $('<img>')
              .attr('src', "#{info.cdnUrl}-/scale_crop/110x110/center/-/quality/lightest/")
              .css(
                width: 'auto'
                height: 55
              )
          ).on 'click', =>
            uploadcare.openPreviewDialog(file, @settings)
              .done (newFile) =>
                @dialogApi.fileColl.replace(file, newFile)

    __fileFailed: (file, error, info) =>
      fileEl = @__fileToEl(file)

      fileEl.addClass(CLASS_PREFIX + 'error')
      @__find('file-error', fileEl)
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
      $(file).data('dpm-el')

    __createFileEl: (file) ->
      fileEl = @__fileTpl.clone()
        .on 'click', '.' + CLASS_PREFIX + 'file-remove', =>
          @dialogApi.fileColl.remove(file)
      $(file).data('dpm-el', fileEl)
      fileEl
