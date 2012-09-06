uploadcare.whenReady ->
  {namespace, jQuery, utils} = uploadcare

  namespace 'uploadcare.api', (ns) ->
    class ns.URLUploader
      constructor: (@settings) ->

      upload: (url) ->
        return unless url?

        # Deferred object that manage responses from status check URL
        @status = jQuery.Deferred()
        @status
          .progress (data) =>
            jQuery(this).trigger('uploadcare.api.uploader.progress') #, {loaded: data.done, fileSize: data.total}
          .done (data) =>
            [@fileName, @fileId] = [data.original_filename, data.file_id]
            jQuery(this).trigger('uploadcare.api.uploader.load')
          .fail =>
            jQuery(this).trigger('uploadcare.api.uploader.error')
          .always =>
            clearInterval @checking

        # Check function to get upload status by token and pass this data to deferred object
        check = (token) =>
          @__status(token)
            .done (data) =>
              if data.status isnt 'unknown'
                [@fileSize, @loaded] = [data.total, data.done]
                
                if @loaded < @fileSize
                  @status.notify data
                else
                  @status.resolve data
            .fail =>
              @status.reject()

        # Make a jsonp-request to upload remote file
        # NOTE: jsonp & cross-domain requests won't trigger the error calls like 404 and stuff
        # Easy step to fix that is to create a separate method with periodical execution, that will check XHR state for 15 seconds and then reject it.
        @xhr = jQuery.ajax("#{@settings['upload-url-base']}/from_url/",
          data: {pub_key: @settings['public-key'], source_url: url}
          dataType: 'jsonp'
          # Fires an event to change widget state to 'started'
          beforeSend: (xhr) =>
            jQuery(this).trigger('uploadcare.api.uploader.start')
        ).done (data) =>
          @token    = data.token

          # Passing token to check func executed with defined check interval
          @checking = setInterval ->
            check(data.token)
          , @settings['progress-check-interval']
        .fail (e) =>
          jQuery(this).trigger('uploadcare.api.uploader.error')

      cancel: ->
        clearInterval(@checking) if @checking?

      # Method to fetch upload status, returns deferred
      __status: (token) ->
        jQuery.ajax("#{@settings['upload-url-base']}/status/", 
          data: {'token': token}
          dataType: 'jsonp'
        )