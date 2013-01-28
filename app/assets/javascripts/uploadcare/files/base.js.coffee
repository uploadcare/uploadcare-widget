uploadcare.whenReady ->
  {namespace, jQuery: $, utils} = uploadcare

  namespace 'uploadcare.files', (ns) ->

    class ns.BaseFile

      constructor: (settings) ->

        @settings = utils.buildSettings settings

        @fileId = null
        @fileName = null
        @fileSize = null
        @isStored = null
        @cdnUrl = null
        @previewUrl = null
        @isImage = null

        @__uploadDf = $.Deferred()
        @__infoDf = $.Deferred()

        @__uploadDf
          .fail (error) => 
            @__infoDf.reject(error, this)
          .done =>
            # FIXME: сделать ленивее, подумав нужно ли
            @__requestInfo()

      __upload: -> # not implemented
      __cancel: -> # not implemented

      __requestInfo: ->
        $.ajax "#{@settings.urlBase}/info/",
          data:
            file_id: @fileId
            pub_key: @settings.publicKey
          dataType: 'jsonp'
        .done (data) =>
          # @fileId = data.file_id
          @fileName = data.original_filename
          @fileSize = data.size
          @isImage = data.is_image
          @isStored = data.is_stored
          # TODO: @previewUrl, @cdnUrl
          @__infoDf.resolve(this)
        .fail =>
          @__infoDf.reject('default', this)

      upload: ->
        @__upload()
        @__uploadDf.promise()

      info: ->
        @__infoDf.promise()
