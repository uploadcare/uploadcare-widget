uploadcare.whenReady ->
  {namespace, jQuery, utils} = uploadcare

  namespace 'uploadcare.api', (ns) ->
    class ns.URLUploader
      constructor: (@settings) ->

      upload: (url) ->
        return unless url?

        @pusher = new Pusher(@settings['pusher-key'])

        @_stateStart()

        @xhr = jQuery.ajax("#{@settings['upload-url-base']}/from_url/",
          data: {pub_key: @settings['public-key'], source_url: url}
          dataType: 'jsonp'
        ).done (data) =>
          @token = data.token

          @channel = @pusher.subscribe("task-status-#{@token}")

          #@channel.bind_all (e, data) => console.log('pusher event', e, data)

          @channel.bind 'pusher:subscription_succeeded', (data) =>
            # avoiding race condition: the file could be downloaded too fast
            setTimeout (=> @_checkStatusFallback() if @_state == 'start'), 300

          @channel.bind 'progress', (data) => @_stateProgress(data)
          @channel.bind 'success', (data) => @_stateSuccess(data)
          @channel.bind 'fail', (data) => @_stateError()
        .fail (e) =>
          @_stateError()

      cancel: ->
        @pusher.unsubscribe("task-status-#{@token}") if @pusher
        @_cleanup()

      ####### Four States of Uploader
      _stateStart: ->
        @_state = 'start'
        jQuery(this).trigger('uploadcare.api.uploader.start')

      _stateProgress: (data) ->
        # avoid progress after success
        return if @_state == 'success'

        @_state = 'progress'

        [@loaded, @fileSize] = [data.done, data.total]
        jQuery(this).trigger('uploadcare.api.uploader.progress')

      _stateSuccess: (data) ->
        # avoiding firing success twice (may happen because of a fallback to /status/ after subscription)
        return if @_state == 'success'

        @_stateProgress(data)

        @_state = 'success'

        [@fileName, @fileId] = [data.original_filename, data.file_id]
        jQuery(this).trigger('uploadcare.api.uploader.load')

        @_cleanup()

      _stateError: ->
        @_state = 'error'
        jQuery(this).trigger('uploadcare.api.uploader.error')

        @_cleanup()

      _cleanup: ->
        if @pusher
          @pusher.disconnect()
          @pusher = null

      # the pull-based fallback in case push-based fails
      _checkStatusFallback: ->
        console.log 'Fallback check :(', @_state, @token

        jQuery.ajax("#{@settings['upload-url-base']}/status/", 
          data: {'token': @token}
          dataType: 'jsonp'
        ).done (data) =>
          @_stateSuccess data if data.status == 'success'

