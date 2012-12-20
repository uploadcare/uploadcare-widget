uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.uploads', (ns) ->
    class ns.FileInfo
      constructor: (@fileId, @fileName, @fileSize) ->
        @df = $.Deferred()

      info: (settings) ->
        if @fileName? && @fileSize?
          @df.resolve(this)
        else
          $.ajax "#{settings.urlBase}/info/",
            data:
              file_id: @fileId
              pub_key: settings.publicKey
            dataType: 'jsonp'
          .done (data) =>
            @fileId = data.file_id
            @fileName = data.original_filename
            @fileSize = data.size
            @df.resolve(this)
          .fail(=> @df.reject())

        @df.promise()
