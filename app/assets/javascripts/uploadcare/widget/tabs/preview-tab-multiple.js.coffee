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
    ROLE_PREFIX = '@' + CLASS_PREFIX

    constructor: ->
      super

      @container.append tpl('tab-preview-multiple')

      @fileListEl = @__find('file-list')
      @filesCountEl = @__find('files-count')
      @footerText = @__find('footer-text')
      @doneBtnEl = @container.find('@uploadcare-dialog-preview-done')
      @__fileTpl = $(tpl 'tab-preview-multiple-file')

      $.each @dialogApi.fileColl.get(), (i, file) =>
        @__fileAdded(file)
        file.then(
          (info) => @__fileDone(file, info),
          (info) => @__fileFailed(file, info),
          (info) => @__fileProgress(file, info)
        )
      @__updateContainerView()

      @dialogApi.fileColl.onAdd.add [@__fileAdded, @__updateContainerView]
      @dialogApi.fileColl.onRemove.add [@__fileRemoved, @__updateContainerView]

      @dialogApi.fileColl.onAnyProgress.add @__fileProgress
      @dialogApi.fileColl.onAnyDone.add @__fileDone
      @dialogApi.fileColl.onAnyFail.add @__fileFailed

      utils.loadPlugin('jquery-ui').done =>
        @fileListEl.sortable
          axis: "y"
          update: =>
            elements = @__find 'file-item'
            index = (file) =>
              elements.index @__fileToEl(file)
            @dialogApi.fileColl.sort (a, b) ->
              index(a) - index(b)

    __find: (s, context = @container) ->
      $(ROLE_PREFIX + s, context)

    __updateContainerView: =>
      files = @dialogApi.fileColl.length()
      tooManyFiles = @settings.multipleMax and files > @settings.multipleMax

      @doneBtnEl.toggleClass('uploadcare-disabled-el', tooManyFiles)

      @filesCountEl.text t('file', files)

      @footerText
        .toggleClass('uploadcare-error', tooManyFiles)
        .text(
          if tooManyFiles
            t('dialog.tabs.preview.multiple.tooManyFiles')
              .replace('%max%', @settings.multipleMax)
          else
            t('dialog.tabs.preview.multiple.question')
        )

    __fileProgress: (file, progressInfo) =>
      fileEl = @__fileToEl(file)

      @__find('file-progressbar-value', fileEl)
        .css('width', Math.round(progressInfo.progress * 100) + '%')

      info = progressInfo.incompleteFileInfo

      @__find('file-name', fileEl)
        .text(info.name or t('dialog.tabs.preview.unknownName'))

      @__find('file-size', fileEl)
        .text(utils.readableFileSize(info.size, '–'))

    __fileDone: (file, info) =>
      fileEl = @__fileToEl(file)

      fileEl.addClass(CLASS_PREFIX + 'uploaded')

      if info.isImage
        fileEl.addClass(CLASS_PREFIX + 'image')

        @__find('file-preview-wrap', fileEl).html $('<img>')
          .attr
            src: "#{info.originalUrl}-/scale_crop/45x45/center/"

    __fileFailed: (file, error, info) =>
      fileEl = @__fileToEl(file)

      fileEl.addClass(CLASS_PREFIX + 'error')
      @__find('file-error', fileEl)
        .text t("errors.#{error}")

    __fileAdded: (file) =>
      $(file).data 'dmp-el', @__createFileEl(file)

    __fileRemoved: (file) =>
      @__fileToEl(file).remove()

    __fileToEl: (file) ->
      $(file).data('dmp-el')

    __createFileEl: (file) ->
      @__fileTpl.clone()
        .appendTo(@fileListEl)
        .on('click', ROLE_PREFIX + 'file-remove', =>
          @dialogApi.fileColl.remove file)
