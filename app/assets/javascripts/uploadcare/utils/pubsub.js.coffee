
# USAGE:
# 
#     var w = new uploadcare.utils.pubsub.PubSubWatcher('window', '123');
#     jQuery(w).on('some-state-name', function(status) { alert(status) })
#
#     # or all of them
#     jQuery(w).on('state-changed', function(status) { alert(status) })
# 
#     w.watch()
#     w.stop() # don't forget, in the end :D
# 

uploadcare.whenReady ->
  {jQuery} = uploadcare

  uploadcare.namespace 'uploadcare.utils.pubsub', (ns) ->
    class ns.PubSubWatcher
      constructor: (@channel, @topic) ->
        @baseUrl = 'http://uploadcare.local:5000/pubsub'

      watch: ->
        @interval = setInterval(
                      => @_checkStatus()
                      2000
                    )

      stop: ->
        clearInterval @interval if @interval
        @interval = null

      _update: (status) ->
        if not @status or @status.score < status.score
          @status = status
          @_notify()

      _notify: ->
        jQuery(this).trigger('state-changed', [@status])
        jQuery(this).trigger(@status.state, [@status])

      _checkStatus: ->
        jQuery.ajax "#{@baseUrl}/status",
          data: {'channel': @channel, 'topic': @topic}
          dataType: 'jsonp'
        .fail =>
          @_update {score: -1, state: 'error'}
        .done (data) =>
          @_update data
