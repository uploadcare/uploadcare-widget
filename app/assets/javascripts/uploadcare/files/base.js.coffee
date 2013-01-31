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
        @cdnUrlModifiers = null
        @previewUrl = null
        @isImage = null

        @upload = null

        @__uploadDf = $.Deferred()
        @__infoDf = $.Deferred()

        @__uploadDf.fail (error) =>
          @__infoDf.reject(error, this)

      __startUpload: -> throw 'not implemented'

      __requestInfo: =>
        $.ajax "#{@settings.urlBase}/info/",
          data:
            file_id: @fileId
            pub_key: @settings.publicKey
          dataType: 'jsonp'
        .done (data) =>
          if data.error
            @__infoDf.reject('info', this)
          else
            @fileName = data.original_filename
            @fileSize = data.size
            @isImage = data.is_image
            @isStored = data.is_stored
            @cdnUrl = "#{@settings.cdnBase}/#{@fileId}/#{@cdnUrlModifiers}"
            # TODO: @previewUrl
            @__infoDf.resolve(this)
        .fail =>
          @__infoDf.reject('info', this)

      startUpload: ->
        unless @upload 
          if @__uploadDf.state() == 'pending'
            @__startUpload()
          @__createPublicUploadDf()
        return @upload

      __createPublicUploadDf: ->
        @upload = @__uploadDf.promise()
        @upload.reject = =>
          @__uploadDf.reject('user', this)


      info: ->
        unless @__requestInfoPlanned
          @__requestInfoPlanned = true
          @__uploadDf.done @__requestInfo
        @__infoDf.promise()
