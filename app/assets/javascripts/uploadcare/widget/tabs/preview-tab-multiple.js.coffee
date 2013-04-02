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

    # dmp — abbreviation of dialog-preview-multiple
    PREFIX = '@uploadcare-dmp-'

    constructor: (@container, @fileColl) ->
      @container.append tpl('tab-preview-multiple')
      @fileListEl = @container.find(PREFIX + 'file-list')
      @__addFile(file) for file in @fileColl.get()
      @fileColl.onAdd.add @__addFile
      @fileColl.onRemove.add @__removeFile

    __addFile: (file) =>
      @__createFileEl(file)

    __removeFile: (file) =>
      @__fileToEl(file).remove()

    __fileToEl: (file) ->
      for el in @container.find(PREFIX + 'file-item')
        return $(el) if $(el).data('file') is file
      null

    __createFileEl: (file) ->
      fileEl = $ tpl('tab-preview-multiple-file')
      fileEl.data {file}
      @fileListEl.append fileEl
      fileEl.find(PREFIX + 'file-remove').click =>
        @fileColl.remove(file)
      file.progress (progressInfo) -> 
        # TODO
