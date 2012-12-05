# = require ./uploaders/file-uploader
# = require ./uploaders/url-uploader

uploadcare.whenReady ->
  {
    namespace
  } = uploadcare

  namespace 'uploadcare.widget', (ns) ->
    class ns.UploadManager
      constructor: (widget) ->
        @current = null
        @uploaders =
          file: new ns.uploaders.FileUploader(widget.settings)
          url: new ns.uploaders.URLUploader(widget.settings)
        widget.addUploader(uploader) for _, uploader of @uploaders

      fromUrl: (url) ->
        @__startWith(@uploaders.url)
        @uploaders.url.upload(url)

      fromFileEvent: (e) =>
        @__startWith(@uploaders.file)
        @uploaders.file.listener(e)

      __startWith: (uploader) ->
        @cancel()
        @current = uploader

      cancel: ->
        @current.cancel() if @current?
