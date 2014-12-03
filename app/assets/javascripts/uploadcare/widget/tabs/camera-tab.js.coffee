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
      @wrap.addClass('uploadcare-dialog-padding uploadcare-dialog-camera-requested')
      @video = @wrap.find('video')

      @video.on 'loadeddata', =>
        @URL.revokeObjectURL(@video.prop('src'))

      @wrap.find('.uploadcare-dialog-camera-capture').on 'click', =>
        video = @video[0]
        w = video.videoWidth
        h = video.videoHeight
        canvas = document.createElement('canvas')
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(video, 0, 0, w, h)

        utils.canvasToBlob canvas, 'image/jpeg', 0.9, (blob) =>
          @dialogApi.addFiles 'object', [blob]

      @wrap.find('.uploadcare-dialog-camera-retry').on 'click', @__requestCamera

      @dialogApi.onSwitched.add (_, switchedToMe) =>
        if switchedToMe and not @__loaded
          @__requestCamera()

      @dialogApi.dialog.always =>
        if @__stream
          @__stream.stop()

    __checkCompatibility: ->
      @getUserMedia = navigator.getUserMedia or navigator.webkitGetUserMedia or navigator.mozGetUserMedia
      @URL = window.URL || window.webkitURL
      return !! @getUserMedia and Uint8Array

    __requestCamera: =>
      @__loaded = true
      @getUserMedia.call(navigator,
        video: true
      , (stream) =>
        @wrap
          .removeClass('uploadcare-dialog-camera-requested')
          .removeClass('uploadcare-dialog-camera-denied')
          .addClass('uploadcare-dialog-camera-ready')
        @__stream = stream
        @video.prop('src', @URL.createObjectURL(stream))
        @video[0].play()
      , (error) =>
        if error.name == 'PermissionDeniedError'
          @wrap.addClass('uploadcare-dialog-camera-denied')
        else if error.name == 'DevicesNotFoundError'
          @wrap.addClass('uploadcare-dialog-camera-not-found')
        @__loaded = false
      )
