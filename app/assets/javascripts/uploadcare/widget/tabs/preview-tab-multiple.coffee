# = require ../../vendor/jquery-ordering.js

{
  utils,
  ui: {progress},
  templates: {tpl},
  jQuery: $,
  locale: {t}
} = uploadcare
uc = uploadcare

uploadcare.namespace 'widget.tabs', (ns) ->

  class ns.PreviewTabMultiple extends ns.BasePreviewTab

    constructor: ->
      super

      @container.append(tpl('tab-preview-multiple'))
      @__fileTpl = $(tpl('tab-preview-multiple-file'))

      @fileListEl = @container.find('.uploadcare--files')
      @doneBtnEl = @container.find('.uploadcare--preview__done')

      $.each @dialogApi.fileColl.get(), (i, file) =>
        @__fileAdded(file)
      @__updateContainerView()

      @dialogApi.fileColl.onAdd.add(@__fileAdded, @__updateContainerView)
      @dialogApi.fileColl.onRemove.add(@__fileRemoved, @__updateContainerView)
      @dialogApi.fileColl.onReplace.add(@__fileReplaced, @__updateContainerView)

      @dialogApi.fileColl.onAnyProgress(@__fileProgress)
      @dialogApi.fileColl.onAnyDone(@__fileDone)
      @dialogApi.fileColl.onAnyFail(@__fileFailed)

      @fileListEl.addClass(
        if @settings.imagesOnly
        then 'uploadcare--files_type_tiles'
        else 'uploadcare--files_type_table'
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
          elements = @container.find('.uploadcare--file')
          index = (file) =>
            elements.index(@__fileToEl(file))
          @dialogApi.fileColl.sort (a, b) ->
            index(a) - index(b)
      )

    __updateContainerView: =>
      files = @dialogApi.fileColl.length()
      tooManyFiles = files > @settings.multipleMax
      tooFewFiles = files < @settings.multipleMin
      hasWrongNumberFiles = tooManyFiles or tooFewFiles

      @doneBtnEl.attr('disabled', hasWrongNumberFiles)

      title = t('dialog.tabs.preview.multiple.question')
        .replace('%files%', t('file', files))
      @container.find('.uploadcare--preview__title').text(title)

      errorContainer = @container.find('.uploadcare--preview__message')
      errorContainer.empty()

      if hasWrongNumberFiles
        wrongNumberFilesMessage = if tooManyFiles
          t('dialog.tabs.preview.multiple.tooManyFiles')
            .replace('%max%', @settings.multipleMax)
        else if files and tooFewFiles
          t('dialog.tabs.preview.multiple.tooFewFiles')
            .replace('%min%', @settings.multipleMin)
            .replace('%files%', t('file', files))

        errorContainer
          .addClass('uploadcare--error')
          .text(wrongNumberFilesMessage)

    __updateFileInfo: (fileEl, info) ->
      filename = info.name or t('dialog.tabs.preview.unknownName')

      fileEl.find('.uploadcare--file__name')
        .text(filename)

      fileEl.find('.uploadcare--file__description')
        .attr('title', t('dialog.tabs.preview.multiple.file.preview').replace('%file%', filename))

      fileEl.find('.uploadcare--file__remove')
        .attr('title', t('dialog.tabs.preview.multiple.file.remove').replace('%file%', filename))

      fileEl.find('.uploadcare--file__size')
        .text(utils.readableFileSize(info.size, '–'))

    __fileProgress: (file, progressInfo) =>
      fileEl = @__fileToEl(file)

      fileEl.find('.uploadcare--progressbar__value')
        .css('width', Math.round(progressInfo.progress * 100) + '%')

      @__updateFileInfo(fileEl, progressInfo.incompleteFileInfo)

    __fileDone: (file, info) =>
      fileEl = @__fileToEl(file)
        .removeClass('uploadcare--file_status_uploading')
        .addClass('uploadcare--file_status_uploaded')

      fileEl.find('.uploadcare--progressbar__value')
        .css('width', '100%')
      @__updateFileInfo(fileEl, info)

      if info.isImage
        cdnURL = "#{info.cdnUrl}-/quality/lightest/-/preview/108x108/"
        cdnURL = @settings.previewUrlCallback(cdnURL, info)
          
        filePreview = $('<img>')
          .attr('src', cdnURL)
          .addClass('uploadcare--file__icon')
      else
        filePreview = $("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-file'/></svg>")
          .attr('role', 'presentation')
          .attr('class', 'uploadcare--icon uploadcare--file__icon')

      fileEl.find('.uploadcare--file__preview')
        .html(filePreview)

      fileEl.find('.uploadcare--file__description').on 'click', =>
          uc.openPreviewDialog(file, @settings)
            .done (newFile) =>
              @dialogApi.fileColl.replace(file, newFile)

    __fileFailed: (file, error, info) =>
      fileEl = @__fileToEl(file)
        .removeClass('uploadcare--file_status_uploading')
        .addClass('uploadcare--file_status_error')

      fileEl.find('.uploadcare--file__error')
        .text(t("errors.#{error}"))

      filePreview = $("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-error'/></svg>")
        .attr('role', 'presentation')
        .attr('class', 'uploadcare--icon uploadcare--file__icon')

      fileEl.find('.uploadcare--file__preview')
        .html(filePreview)

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
        .on 'click', '.uploadcare--file__remove', =>
          @dialogApi.fileColl.remove(file)
      $(file).data('dpm-el', fileEl)
      fileEl
