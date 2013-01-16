uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.uploads', (ns) ->
    ns.fileInfo = (fileId, settings) ->
      df = $.Deferred()
      $.ajax "#{settings.urlBase}/info/",
        data:
          file_id: fileId
          pub_key: settings.publicKey
        dataType: 'jsonp'
      .done (data) =>
        df.resolve
          fileId: data.file_id
          fileName: data.original_filename
          fileSize: data.size
          image: data.is_image
          isStored: data.is_stored
      .fail(=> df.reject())

      df.promise()

    ns.isImage = (infos...) ->
      return false for info in infos when not info.image
      true
