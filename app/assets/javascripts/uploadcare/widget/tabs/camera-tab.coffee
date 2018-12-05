{
  utils,
  jQuery: $,
  templates: {tpl}
} = uploadcare


uploadcare.namespace 'widget.tabs', (ns) ->
  isSecure = document.location.protocol == 'https:'

  class ns.CameraTab

    constructor: (@container, @tabButton, @dialogApi, @settings, @name) ->
      if @__checkCapture()
        @container.append(tpl('tab-camera-capture'))
        @container.addClass('uploadcare--camera')
        @container.find('.uploadcare--camera__button_type_photo').on('click', @__captureInput('image/*'))
        video = @container.find('.uploadcare--camera__button_type_video').on('click', @__captureInput('video/*'))
        if @settings.imagesOnly
          video.hide()
      else
        if not @__checkCompatibility()
          @dialogApi.hideTab(@name)
          return
        @__initCamera()

    __captureInput: (accept) =>
      => utils.fileSelectDialog @container, {inputAcceptTypes: accept}, @__captureInputHandle, {capture: 'camera'}

    __captureInputHandle: (input) =>
      @dialogApi.addFiles('object', input.files)
      @dialogApi.switchTab('preview')

    __initCamera: ->
      @__loaded = false
      @mirrored = true

      @container.append(tpl('tab-camera'))
      @container.addClass('uploadcare--camera')
      @container.addClass('uploadcare--camera_status_requested')
      @container.find('.uploadcare--camera__button_type_capture').on('click', @__capture)
      startRecord = @container.find('.uploadcare--camera__button_type_start-record').on('click', @__startRecording)
      @container.find('.uploadcare--camera__button_type_stop-record').on('click', @__stopRecording)
      @container.find('.uploadcare--camera__button_type_cancel-record').on('click', @__cancelRecording)
      @container.find('.uploadcare--camera__button_type_mirror').on('click', @__mirror)
      @container.find('.uploadcare--camera__button_type_retry').on('click', @__requestCamera)

      if not @MediaRecorder or @settings.imagesOnly
        startRecord.hide()

      @video = @container.find('.uploadcare--camera__video')
      @video.on 'loadeddata', ->
        @play()

      @dialogApi.progress (name) =>
        if name == @name
          if not @__loaded
            @__requestCamera()
        else
          if @__loaded and isSecure
            @__revoke()

      @dialogApi.always(@__revoke)

    __checkCompatibility: ->
      if navigator.mediaDevices and navigator.mediaDevices.getUserMedia
        @getUserMedia = (constraints, successCallback, errorCallback) ->
          navigator.mediaDevices.getUserMedia(constraints)
            .then(successCallback)
            .catch(errorCallback)
      else
        @getUserMedia = navigator.getUserMedia or navigator.webkitGetUserMedia or navigator.mozGetUserMedia
      @URL = window.URL or window.webkitURL
      @MediaRecorder = window.MediaRecorder
      if not isSecure
        utils.warn('Camera is not allowed for HTTP. Please use HTTPS connection.');
      isLocalhost = document.location.hostname == 'localhost'
      return !! @getUserMedia and Uint8Array and (isSecure or isLocalhost)

    __checkCapture: () ->
      input = document.createElement('input')
      input.setAttribute('capture', 'camera')
      return !! input.capture

    __setState: (newState) =>
      oldStates = ['', 'ready', 'requested', 'denied', 'not-founded',
                   'recording'].join(' uploadcare--camera_status_')
      @container
          .removeClass(oldStates)
          .addClass("uploadcare--camera_status_#{newState}")

    __requestCamera: =>
      @__loaded = true
      @getUserMedia.call(navigator,
        audio: true,
        video:
          optional: [
            {minWidth: 320},
            {minWidth: 640},
            {minWidth: 1024},
            {minWidth: 1280},
            {minWidth: 1920},
          ]
      , (stream) =>
        @__setState('ready')

        @__stream = stream
        if 'srcObject' of @video[0]
          @video.prop('srcObject', stream)
          @video.on('loadedmetadata', () => @video[0].play())
        else
          if @URL
            @__streamObject = @URL.createObjectURL(stream)
            @video.prop('src', @__streamObject)
          else
            @video.prop('src', stream)
          @video[0].play()

      , (error) =>
        if error == "NO_DEVICES_FOUND" or error.name == 'DevicesNotFoundError'
          @__setState('not-founded')
        else
          @__setState('denied')
        @__loaded = false
      )

    __revoke: =>
      @__setState('requested')

      @__loaded = false
      if not @__stream
        return
      if @__streamObject
        @URL.revokeObjectURL(@__streamObject)
      if @__stream.getTracks
        $.each @__stream.getTracks(), ->
          @stop?()
      else
        @__stream.stop?()
      @__stream = null

    __mirror: =>
      @mirrored = ! @mirrored
      @video.toggleClass('uploadcare--camera__video_mirrored', @mirrored)

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
        canvas.width = canvas.height = 1
        blob.name = "camera.jpg"
        @dialogApi.addFiles('object', [[blob, {source: 'camera'}]])
        @dialogApi.switchTab('preview')

    __startRecording: =>
      @__setState('recording')

      @__chunks = []
      __recorderOptions = {}

      if @settings.audioBitsPerSecond != null
        __recorderOptions.audioBitsPerSecond = @settings.audioBitsPerSecond

      if @settings.videoBitsPerSecond != null
        __recorderOptions.videoBitsPerSecond = @settings.videoBitsPerSecond

      if Object.keys(__recorderOptions).length != 0
        @__recorder = new @MediaRecorder(@__stream, __recorderOptions)
      else
        @__recorder = new @MediaRecorder(@__stream)

      @__recorder.start()
      @__recorder.ondataavailable = (e) =>
        @__chunks.push(e.data)

    __stopRecording: =>
      @__setState('ready')

      @__recorder.onstop = =>
        blob = new Blob(@__chunks, {'type': @__recorder.mimeType})
        ext = @__guessExtensionByMime(@__recorder.mimeType)
        blob.name = "record.#{ext}"
        @dialogApi.addFiles('object', [[blob, {source: 'camera'}]])
        @dialogApi.switchTab('preview')
        @__chunks = []
      @__recorder.stop()

    __cancelRecording: =>
      @__setState('ready')

      @__recorder.stop()
      @__chunks = []

    __guessExtensionByMime: (mime) ->
      known_containers = {
        'mp4': 'mp4',
        'ogg': 'ogg',
        'webm': 'webm',
        'quicktime': 'mov',
        'x-matroska': 'mkv',
      }
      # MediaRecorder.mimeType returns empty string in Firefox.
      # Firefox record video as WebM now by default.
      # @link https://bugzilla.mozilla.org/show_bug.cgi?id=1512175
      if mime == ''
        return 'webm'
      # e.g. "video/x-matroska;codecs=avc1,opus"
      if mime
        # e.g. ["video", "x-matroska;codecs=avc1,opus"]
        mime = mime.split('/')
        if mime[0] == 'video'
          # e.g. "x-matroska;codecs=avc1,opus"
          mime = mime.slice(1).join('/')
          # e.g. "x-matroska"
          container = mime.split(';')[0]
          # e.g. "mkv"
          if known_containers[container]
            return known_containers[container]
      # In all other cases just return the base extension for all times
      return 'avi'
