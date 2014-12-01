{
  namespace,
  utils,
  jQuery: $,
  templates: {tpl}
} = uploadcare


namespace 'uploadcare.widget.tabs', (ns) ->
  class ns.CameraTab extends ns.BaseSourceTab

    constructor: ->
      super

      if not @__checkCompatibility()
        @wrap.hide()
        @tabButton.hide()
        return

      @__loaded = false

      @wrap.append tpl 'tab-camera'
      @video = @wrap.find('video')

      @video.on 'loadeddata', =>
        @URL.revokeObjectURL(video.prop('src'))

      @dialogApi.onSwitched.add (_, switchedToMe) =>
          if switchedToMe and not @__loaded
            @__requestCamera()

      @dialogApi.dialog.always =>
        if @__stream
          @__stream.stop()

    __checkCompatibility: ->
      @getUserMedia = navigator.getUserMedia or navigator.webkitGetUserMedia or navigator.mozGetUserMedia
      @URL = window.URL || window.webkitURL
      return !! @getUserMedia and @URL and Uint8Array

    __requestCamera: ->
      @__loaded = true
      @getUserMedia.call(navigator,
        video: true
      , (stream) =>
        @__stream = stream
        @video.prop('src', @URL.createObjectURL(stream))
        @video[0].play()
      , ->
        @__loaded = false
      )
