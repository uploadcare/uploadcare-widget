import $ from 'jquery'
import { warn } from '../../utils/warnings'
import { fileSelectDialog, canvasToBlob } from '../../utils'
import { tpl } from '../../templates'

var isSecure = document.location.protocol === 'https:'

class CameraTab {
  constructor (container1, tabButton, dialogApi, settings, name1) {
    var video
    this.__captureInput = this.__captureInput.bind(this)
    this.__captureInputHandle = this.__captureInputHandle.bind(this)
    this.__setState = this.__setState.bind(this)
    this.__requestCamera = this.__requestCamera.bind(this)
    this.__revoke = this.__revoke.bind(this)
    this.__mirror = this.__mirror.bind(this)
    this.__capture = this.__capture.bind(this)
    this.__startRecording = this.__startRecording.bind(this)
    this.__stopRecording = this.__stopRecording.bind(this)
    this.__cancelRecording = this.__cancelRecording.bind(this)
    this.container = container1
    this.tabButton = tabButton
    this.dialogApi = dialogApi
    this.settings = settings
    this.name = name1
    if (this.__checkCapture()) {
      this.container.append(tpl('tab-camera-capture'))
      this.container.addClass('uploadcare--camera')
      this.container.find('.uploadcare--camera__button_type_photo').on('click', this.__captureInput('image/*'))
      video = this.container.find('.uploadcare--camera__button_type_video').on('click', this.__captureInput('video/*'))
      if (this.settings.imagesOnly) {
        video.hide()
      }
    } else {
      if (!this.__checkCompatibility()) {
        this.dialogApi.hideTab(this.name)
        return
      }
      this.__initCamera()
    }
  }

  __captureInput (accept) {
    return () => {
      return fileSelectDialog(this.container, {
        inputAcceptTypes: accept
      }, this.__captureInputHandle, {
        capture: 'camera'
      })
    }
  }

  __captureInputHandle (input) {
    this.dialogApi.addFiles('object', input.files)
    return this.dialogApi.switchTab('preview')
  }

  __initCamera () {
    var startRecord
    this.__loaded = false
    this.mirrored = true
    this.container.append(tpl('tab-camera'))
    this.container.addClass('uploadcare--camera')
    this.container.addClass('uploadcare--camera_status_requested')
    this.container.find('.uploadcare--camera__button_type_capture').on('click', this.__capture)
    startRecord = this.container.find('.uploadcare--camera__button_type_start-record').on('click', this.__startRecording)
    this.container.find('.uploadcare--camera__button_type_stop-record').on('click', this.__stopRecording)
    this.container.find('.uploadcare--camera__button_type_cancel-record').on('click', this.__cancelRecording)
    this.container.find('.uploadcare--camera__button_type_mirror').on('click', this.__mirror)
    this.container.find('.uploadcare--camera__button_type_retry').on('click', this.__requestCamera)
    if (!this.MediaRecorder || this.settings.imagesOnly) {
      startRecord.hide()
    }
    this.video = this.container.find('.uploadcare--camera__video')
    this.video.on('loadeddata', function () {
      return this.play()
    })
    this.dialogApi.progress((name) => {
      if (name === this.name) {
        if (!this.__loaded) {
          return this.__requestCamera()
        }
      } else {
        if (this.__loaded && isSecure) {
          return this.__revoke()
        }
      }
    })
    return this.dialogApi.always(this.__revoke)
  }

  __checkCompatibility () {
    var isLocalhost
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.getUserMedia = function (constraints, successCallback, errorCallback) {
        return navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback)
      }
    } else {
      this.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    }
    this.URL = window.URL || window.webkitURL
    this.MediaRecorder = window.MediaRecorder
    if (!isSecure) {
      warn('Camera is not allowed for HTTP. Please use HTTPS connection.')
    }
    isLocalhost = document.location.hostname === 'localhost'
    return !!this.getUserMedia && Uint8Array && (isSecure || isLocalhost)
  }

  __checkCapture () {
    var input
    input = document.createElement('input')
    input.setAttribute('capture', 'camera')
    return !!input.capture
  }

  __setState (newState) {
    const oldStates = ['', 'ready', 'requested', 'denied', 'not-founded', 'recording'].join(' uploadcare--camera_status_')

    this.container.removeClass(oldStates).addClass(`uploadcare--camera_status_${newState}`)
    this.container.find('.uploadcare--camera__button').focus()
  }

  __requestCamera () {
    this.__loaded = true
    return this.getUserMedia.call(navigator, {
      audio: true,
      video: {
        optional: [
          {
            minWidth: 320
          },
          {
            minWidth: 640
          },
          {
            minWidth: 1024
          },
          {
            minWidth: 1280
          },
          {
            minWidth: 1920
          }
        ]
      }
    }, (stream) => {
      this.__setState('ready')
      this.__stream = stream
      if ('srcObject' in this.video[0]) {
        this.video.prop('srcObject', stream)
        return this.video.on('loadedmetadata', () => {
          return this.video[0].play()
        })
      } else {
        if (this.URL) {
          this.__streamObject = this.URL.createObjectURL(stream)
          this.video.prop('src', this.__streamObject)
        } else {
          this.video.prop('src', stream)
        }
        return this.video[0].play()
      }
    }, (error) => {
      if (error === 'NO_DEVICES_FOUND' || error.name === 'DevicesNotFoundError') {
        this.__setState('not-founded')
      } else {
        this.__setState('denied')
      }
      this.__loaded = false
      return this.__loaded
    })
  }

  __revoke () {
    var base
    this.__setState('requested')
    this.__loaded = false
    if (!this.__stream) {
      return
    }
    if (this.__streamObject) {
      this.URL.revokeObjectURL(this.__streamObject)
    }
    if (this.__stream.getTracks) {
      $.each(this.__stream.getTracks(), function () {
        return typeof this.stop === 'function' ? this.stop() : undefined
      })
    } else {
      if (typeof (base = this.__stream).stop === 'function') {
        base.stop()
      }
    }
    this.__stream = null
    return this.__stream
  }

  __mirror () {
    this.mirrored = !this.mirrored
    return this.video.toggleClass('uploadcare--camera__video_mirrored', this.mirrored)
  }

  __capture () {
    var canvas, ctx, h, video, w
    video = this.video[0]
    w = video.videoWidth
    h = video.videoHeight
    canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    ctx = canvas.getContext('2d')
    if (this.mirrored) {
      ctx.translate(w, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, w, h)
    return canvasToBlob(canvas, 'image/jpeg', 0.9, (blob) => {
      canvas.width = canvas.height = 1
      blob.name = 'camera.jpg'
      this.dialogApi.addFiles('object', [
        [
          blob,
          {
            source: 'camera'
          }
        ]
      ])
      return this.dialogApi.switchTab('preview')
    })
  }

  __startRecording () {
    var __recorderOptions
    this.__setState('recording')
    this.__chunks = []
    __recorderOptions = {}
    if (this.settings.audioBitsPerSecond !== null) {
      __recorderOptions.audioBitsPerSecond = this.settings.audioBitsPerSecond
    }
    if (this.settings.videoBitsPerSecond !== null) {
      __recorderOptions.videoBitsPerSecond = this.settings.videoBitsPerSecond
    }
    if (Object.keys(__recorderOptions).length !== 0) {
      this.__recorder = new this.MediaRecorder(this.__stream, __recorderOptions)
    } else {
      this.__recorder = new this.MediaRecorder(this.__stream)
    }
    this.__recorder.start()

    this.__recorder.ondataavailable = (e) => {
      return this.__chunks.push(e.data)
    }

    return this.__recorder.ondataavailable
  }

  __stopRecording () {
    this.__setState('ready')
    this.__recorder.onstop = () => {
      var blob, ext
      blob = new window.Blob(this.__chunks, {
        type: this.__recorder.mimeType
      })
      ext = this.__guessExtensionByMime(this.__recorder.mimeType)
      blob.name = `record.${ext}`
      this.dialogApi.addFiles('object', [
        [
          blob,
          {
            source: 'camera'
          }
        ]
      ])
      this.dialogApi.switchTab('preview')
      this.__chunks = []

      return this.__chunks
    }
    return this.__recorder.stop()
  }

  __cancelRecording () {
    this.__setState('ready')
    this.__recorder.stop()
    this.__chunks = []
    return this.__chunks
  }

  __guessExtensionByMime (mime) {
    const knownContainers = {
      mp4: 'mp4',
      ogg: 'ogg',
      webm: 'webm',
      quicktime: 'mov',
      'x-matroska': 'mkv'
    }

    // MediaRecorder.mimeType returns empty string in Firefox.
    // Firefox record video as WebM now by default.
    // @link https://bugzilla.mozilla.org/show_bug.cgi?id=1512175
    if (mime === '') {
      return 'webm'
    }

    // e.g. "video/x-matroska;codecs=avc1,opus"
    if (mime) {
      // e.g. ["video", "x-matroska;codecs=avc1,opus"]
      mime = mime.split('/')
      if (mime[0] === 'video') {
        // e.g. "x-matroska;codecs=avc1,opus"
        mime = mime.slice(1).join('/')
        // e.g. "x-matroska"
        const container = mime.split(';')[0]
        // e.g. "mkv"
        if (knownContainers[container]) {
          return knownContainers[container]
        }
      }
    }

    // In all other cases just return the base extension for all times
    return 'avi'
  }

  displayed () {
    this.container.find('.uploadcare--camera__button').focus()
  }
}

export { CameraTab }
