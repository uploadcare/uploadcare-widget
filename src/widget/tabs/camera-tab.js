import { warn } from '../../utils/warnings'
import { fileSelectDialog, canvasToBlob, parseHTML } from '../../utils'
import { tpl } from '../../templates'
import { isWindowDefined } from '../../utils/is-window-defined'

var isSecure = isWindowDefined() && document.location.protocol === 'https:'

class CameraTab {
  constructor(container, tabButton, dialogApi, settings, name) {

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
    this.container = container
    this.tabButton = tabButton
    this.dialogApi = dialogApi
    this.settings = settings
    this.name = name
    if (this.__checkCapture()) {
      this.container.appendChild(parseHTML(tpl('tab-camera-capture')))
      this.container.classList.add('uploadcare--camera')
      this.container
        .querySelector('.uploadcare--camera__button_type_photo')
        .addEventListener('click', this.__captureInput('image/*'))

      const video = this.container
        .querySelector('.uploadcare--camera__button_type_video')
        .addEventListener('click', this.__captureInput('video/*'))

      if (this.settings.imagesOnly) {
        video.style.display = 'none'
      }
    } else {
      if (!this.__checkCompatibility()) {
        this.dialogApi.hideTab(this.name)
        return
      }
      this.__initCamera()
    }
  }

  __captureInput(accept) {
    return () => {
      return fileSelectDialog(
        this.container,
        {
          inputAcceptTypes: accept
        },
        this.__captureInputHandle,
        {
          capture: 'camera'
        }
      )
    }
  }

  __captureInputHandle(input) {
    this.dialogApi.addData('object', input.files)
    return this.dialogApi.switchTab('preview')
  }

  __initCamera() {
    this.__loaded = false
    this.mirrored = true
    this.container.appendChild(parseHTML(tpl('tab-camera')))
    this.container.classList.add('uploadcare--camera')
    this.container.classList.add('uploadcare--camera_status_requested')
    this.container
      .querySelector('.uploadcare--camera__button_type_capture')
      .addEventListener('click', this.__capture)
    const startRecord = this.container
      .querySelector('.uploadcare--camera__button_type_start-record')
    startRecord.addEventListener('click', this.__startRecording)
    this.container
      .querySelector('.uploadcare--camera__button_type_stop-record')
      .addEventListener('click', this.__stopRecording)
    this.container
      .querySelector('.uploadcare--camera__button_type_cancel-record')
      .addEventListener('click', this.__cancelRecording)
    this.container
      .querySelector('.uploadcare--camera__button_type_mirror')
      .addEventListener('click', this.__mirror)
    this.container
      .querySelector('.uploadcare--camera__button_type_retry')
      .addEventListener('click', this.__requestCamera)
    if (!this.MediaRecorder || this.settings.imagesOnly) {
      startRecord.style.display = 'none'
    }
    this.video = this.container.querySelector('.uploadcare--camera__video')
    this.video.addEventListener('loadeddata', function() {
      return this.play()
    })

    this.dialogApi.progress(name => {
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

  __checkCompatibility() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.getUserMedia = function(
        constraints,
        successCallback,
        errorCallback
      ) {
        return navigator.mediaDevices
          .getUserMedia(constraints)
          .then(successCallback)
          .catch(errorCallback)
      }
    } else {
      this.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
    }
    this.URL = window.URL || window.webkitURL
    this.MediaRecorder = window.MediaRecorder
    if (!isSecure ) {
      warn('Camera is not allowed for HTTP. Please use HTTPS connection.')
    }
    const isLocalhost = document.location.hostname === 'localhost'
    return !!this.getUserMedia && Uint8Array && (isSecure || isLocalhost)
  }

  __checkCapture() {
    var input = document.createElement('input')
    input.setAttribute('capture', 'camera')
    return !!input.capture
  }

  __setState(newState) {
    const oldStates = [
      'uploadcare--camera_status_ready',
      'uploadcare--camera_status_requested',
      'uploadcare--camera_status_denied',
      'uploadcare--camera_status_not-founded',
      'uploadcare--camera_status_recording'
    ]

    oldStates.forEach(state => {
      this.container.classList.remove(state)
    })

    this.container.classList.add(`uploadcare--camera_status_${newState}`)
    this.container.querySelector('.uploadcare--camera__button').focus()
  }

  __requestCamera() {
    this.__loaded = true
    return this.getUserMedia.call(
      navigator,
      {
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
      },
      stream => {
        this.__setState('ready')
        this.__stream = stream
        if ('srcObject' in this.video) {
          this.video.srcObject = stream
          this.video.addEventListener('loadedmetadata', () => {
            this.video.play()
          })
        } else {
          if (this.URL) {
            this.__streamObject = this.URL.createObjectURL(stream)
            this.video.src = this.__streamObject
          } else {
            this.video.src = stream
          }

          return this.video.play()
        }
      },
      error => {
        if (
          error === 'NO_DEVICES_FOUND' ||
          error.name === 'DevicesNotFoundError'
        ) {
          this.__setState('not-founded')
        } else {
          this.__setState('denied')
        }
        this.__loaded = false
        return this.__loaded
      }
    )
  }

  __revoke() {
    this.__setState('requested')
    this.__loaded = false
    if (!this.__stream) {
      return
    }
    if (this.__streamObject) {
      this.URL.revokeObjectURL(this.__streamObject)
    }
    if (this.__stream.getTracks) {
      this.__stream.getTracks().forEach((track) => {
        typeof track.stop === 'function' && track.stop()
      })
    } else {
      if (typeof this.__stream.stop === 'function') {
        this.__stream.stop()
      }
    }
    this.__stream = null
    return this.__stream
  }

  __mirror() {
    this.mirrored = !this.mirrored
    return this.video.classList.toggle(
      'uploadcare--camera__video_mirrored',
      this.mirrored
    )
  }

  __capture() {
    var canvas, ctx, h, video, w
    video = this.video
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

    return canvasToBlob(canvas, 'image/jpeg', 0.9, blob => {
      canvas.width = canvas.height = 1
      blob.name = 'camera.jpg'
      this.dialogApi.addData('object', blob)
      return this.dialogApi.switchTab('preview')
    })
  }

  __startRecording() {
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

    this.__recorder.ondataavailable = e => {
      return this.__chunks.push(e.data)
    }

    return this.__recorder.ondataavailable
  }

  __stopRecording() {
    this.__setState('ready')
    this.__recorder.onstop = () => {
      const blob = new window.Blob(this.__chunks, {
        type: this.__recorder.mimeType
      })
      const ext = this.__guessExtensionByMime(this.__recorder.mimeType)
      blob.name = `record.${ext}`

      this.dialogApi.addData('object', blob)
      this.dialogApi.switchTab('preview')
      this.__chunks = []

      return this.__chunks
    }
    return this.__recorder.stop()
  }

  __cancelRecording() {
    this.__setState('ready')
    this.__recorder.stop()
    this.__chunks = []
    return this.__chunks
  }

  __guessExtensionByMime(mime) {
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

  displayed() {
    this.container.querySelector('.uploadcare--camera__button').focus()
  }
}

export { CameraTab }
