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
      @mirrored = true

      @wrap.append tpl 'tab-camera'
      @wrap.addClass('uploadcare-dialog-padding uploadcare-dialog-camera-requested')
      @wrap.find('.uploadcare-dialog-camera-capture').on 'click', @__capture
      @wrap.find('.uploadcare-dialog-camera-mirror').on 'click', @__mirror
      @wrap.find('.uploadcare-dialog-camera-retry').on 'click', @__requestCamera

      @video = @wrap.find('video')
      @video.on 'loadeddata', ->
        @play()

      @dialogApi.onSwitched.add (_, switchedToMe) =>
        if switchedToMe and not @__loaded
          @__requestCamera()

      @dialogApi.dialog.always =>
        @URL?.revokeObjectURL(@video.prop('src'))
        @__stream?.stop?()

    __checkCompatibility: ->
      @getUserMedia = navigator.getUserMedia or navigator.webkitGetUserMedia or navigator.mozGetUserMedia
      @URL = window.URL or window.webkitURL
      return !! @getUserMedia and Uint8Array

    __requestCamera: =>
      @__loaded = true
      @getUserMedia.call(navigator,
        video:
          optional: [
            {minWidth: 320},
            {minWidth: 640},
            {minWidth: 1024},
            {minWidth: 1280},
            {minWidth: 1920}
          ]
      , (stream) =>
        @wrap
          .removeClass('uploadcare-dialog-camera-requested')
          .removeClass('uploadcare-dialog-camera-denied')
          .addClass('uploadcare-dialog-camera-ready')
        @__stream = stream
        if @URL
          @video.prop('src', @URL.createObjectURL(stream))
        else
          @video.prop('src', stream)
        @video[0].play()
      , (error) =>
        if error == "NO_DEVICES_FOUND" or error.name == 'DevicesNotFoundError'
          @wrap.addClass('uploadcare-dialog-camera-not-founded')
        else
          @wrap.addClass('uploadcare-dialog-camera-denied')
        @__loaded = false
      )

    __mirror: =>
      @mirrored = ! @mirrored
      @video.toggleClass('uploadcare-dialog-camera--mirrored', @mirrored)

    __capture: =>
      video = @video[0]
      w = video.videoWidth
      h = video.videoHeight
      canvas = document.createElement('canvas')
      canvas.width = w;
      canvas.height = h;
      ctx = canvas.getContext('2d')
      if @mirrored
        ctx.translate(w, 0)
        ctx.scale(-1, 1)
      ctx.drawImage(video, 0, 0, w, h)

      utils.canvasToBlob canvas, 'image/jpeg', 0.9, (blob) =>
        blob.name = "camera.jpg"
        @dialogApi.addFiles 'object', [blob]
