{
  namespace,
  utils,
  ui: {progress},
  templates: {tpl},
  jQuery: $,
  crop: {CropWidget},
  locale: {t}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->

  class ns.GroupView

    # dpm — abbreviation of dialog-preview-multiple
    CLASS_PREFIX = 'uploadcare-dpm-'
    ROLE_PREFIX = '@' + CLASS_PREFIX

    constructor: (@container, @fileColl) ->
      @container.append tpl('tab-preview-multiple')

      @fileListEl = @__find('file-list')
      @filesCountEl = @__find('files-count')
      # @doneBtnEl = @container.find('@uploadcare-dialog-preview-done')
      
      @__addFile(file) for file in @fileColl.get()

      @fileColl.onAdd.add [@__addFile, @__updateContainerView]
      @fileColl.onRemove.add [@__removeFile, @__updateContainerView]

      @fileColl.onAnyProgress.add @__updateFileView

      @fileColl.onAnyFail.add (file, error) =>
        @__fileToEl(file).addClass(CLASS_PREFIX + 'error')

      @fileColl.onAnyDone.add (file, info) =>
        @__fileToEl(file).addClass(CLASS_PREFIX + 'uploaded')

    __find: (s, context = @container) ->
      $(ROLE_PREFIX + s, context)

    __updateContainerView: =>
      @filesCountEl.text t('file', @fileColl.length())
      # @doneBtnEl.toggleClass('uploadcare-disabled-el', @fileColl.length() == 0)

    __updateFileView: (file, progressInfo) =>
      info = progressInfo.incompleteFileInfo
      fileEl = @__fileToEl(file)

      fileEl.toggleClass(CLASS_PREFIX + 'image', info.isImage)
      if info.isImage
        @__find('file-preview', fileEl).attr('src', info.previewUrl)

      @__find('file-name', fileEl)
        .text(info.name or t('dialog.tabs.preview.unknownName'))

      @__find('file-size', fileEl)
        .text(utils.readableFileSize(info.size, '–'))

      @__find('file-progressbar-value', fileEl)
        .css('width', Math.round(progressInfo.progress * 100) + '%')

    __addFile: (file) =>
      $(file).data 'dmp-el', @__createFileEl(file)

    __removeFile: (file) =>
      @__fileToEl(file).remove()

    __fileToEl: (file) ->
      $(file).data('dmp-el')

    __createFileEl: (file) ->
      $(tpl 'tab-preview-multiple-file')
        .appendTo(@fileListEl)
        .on('click', ROLE_PREFIX + 'file-remove', (=> @fileColl.remove file))

# TODO:
#   disable done button if:
#     - no files
#     - some files in progress ??? (No, instead 
#          add ability to open dialog with that files again)
#     - all files failed
#   update file view (also error state)
#   update container view
#   total progress
