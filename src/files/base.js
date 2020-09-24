import $ from 'jquery'

import { log, debug } from '../utils/warnings'
import { jsonp, fixedPipe } from '../utils'

// files

// progressState: one of 'error', 'ready', 'uploading', 'uploaded'
// internal api
//   __notifyApi: file upload in progress
//   __resolveApi: file is ready
//   __rejectApi: file failed on any stage
//   __completeUpload: file uploaded, info required
class BaseFile {
  constructor(param, settings1, sourceInfo = {}) {
    var base

    this.settings = settings1
    this.sourceInfo = sourceInfo
    this.fileId = null
    this.fileName = null
    this.sanitizedName = null
    this.fileSize = null
    this.isStored = null
    this.cdnUrlModifiers = null
    this.isImage = null
    this.imageInfo = null
    this.mimeType = null
    this.s3Bucket = null
    ;(base = this.sourceInfo).source || (base.source = this.sourceName)
    this.__setupValidation()
    this.__initApi()
  }

  __startUpload() {
    return $.Deferred().resolve()
  }

  __completeUpload() {
    var check, logger, ncalls, timeout
    // Update info until @apiDeferred resolved.
    ncalls = 0
    if (this.settings.debugUploads) {
      debug('Load file info.', this.fileId, this.settings.publicKey)
      logger = setInterval(() => {
        return debug(
          'Still waiting for file ready.',
          ncalls,
          this.fileId,
          this.settings.publicKey
        )
      }, 5000)
      this.apiDeferred
        .done(() => {
          return debug(
            'File uploaded.',
            ncalls,
            this.fileId,
            this.settings.publicKey
          )
        })
        .always(() => {
          return clearInterval(logger)
        })
    }
    timeout = 100
    return (check = () => {
      if (this.apiDeferred.state() === 'pending') {
        ncalls += 1
        return this.__updateInfo().done(() => {
          setTimeout(check, timeout)
          timeout += 50
          return timeout
        })
      }
    })()
  }

  __updateInfo() {
    return jsonp(
      `${this.settings.urlBase}/info/`,
      'GET',
      {
        jsonerrors: 1,
        file_id: this.fileId,
        pub_key: this.settings.publicKey,
        // Assume that we have all other info if isImage is set to something
        // other than null and we only waiting for is_ready flag.
        wait_is_ready: +(this.isImage === null)
      },
      {
        headers: {
          'X-UC-User-Agent': this.settings._userAgent
        }
      }
    )
      .fail(reason => {
        if (this.settings.debugUploads) {
          log(
            "Can't load file info. Probably removed.",
            this.fileId,
            this.settings.publicKey,
            reason
          )
        }
        return this.__rejectApi('info')
      })
      .done(this.__handleFileData.bind(this))
  }

  __handleFileData(data) {
    this.fileName = data.original_filename
    this.sanitizedName = data.filename
    this.fileSize = data.size
    this.isImage = data.is_image
    this.imageInfo = data.image_info
    this.mimeType = data.mime_type
    this.isStored = data.is_stored
    this.s3Bucket = data.s3_bucket
    if (data.default_effects) {
      this.cdnUrlModifiers = '-/' + data.default_effects
    }
    if (this.s3Bucket && this.cdnUrlModifiers) {
      this.__rejectApi('baddata')
    }
    this.__runValidators()
    if (data.is_ready) {
      return this.__resolveApi()
    }
  }

  // Retrieve info

  __progressInfo() {
    var ref
    return {
      state: this.__progressState,
      uploadProgress: this.__progress,
      progress:
        (ref = this.__progressState) === 'ready' || ref === 'error'
          ? 1
          : this.__progress * 0.9,
      incompleteFileInfo: this.__fileInfo()
    }
  }

  __fileInfo() {
    var urlBase
    if (this.s3Bucket) {
      urlBase = `https://${this.s3Bucket}.s3.amazonaws.com/${this.fileId}/${this.sanitizedName}`
    } else {
      urlBase = `${this.settings.cdnBase}/${this.fileId}/`
    }

    return {
      uuid: this.fileId,
      name: this.fileName,
      size: this.fileSize,
      isStored: this.isStored,
      isImage: !this.s3Bucket && this.isImage,
      originalImageInfo: this.imageInfo,
      mimeType: this.mimeType,
      originalUrl: this.fileId ? urlBase : null,
      cdnUrl: this.fileId ? `${urlBase}${this.cdnUrlModifiers || ''}` : null,
      cdnUrlModifiers: this.cdnUrlModifiers,
      sourceInfo: this.sourceInfo
    }
  }

  // Validators

  __setupValidation() {
    this.validators =
      this.settings.validators || this.settings.__validators || []
    if (this.settings.imagesOnly) {
      return this.validators.push(function(info) {
        if (info.isImage === false) {
          throw new Error('image')
        }
      })
    }
  }

  __runValidators() {
    var err, i, info, len, ref, results, v
    info = this.__fileInfo()
    try {
      ref = this.validators
      results = []
      for (i = 0, len = ref.length; i < len; i++) {
        v = ref[i]
        results.push(v(info))
      }
      return results
    } catch (error) {
      err = error
      return this.__rejectApi(err.message)
    }
  }

  // Internal API control

  __initApi() {
    this.apiDeferred = $.Deferred()
    this.__progressState = 'uploading'
    this.__progress = 0
    return this.__notifyApi()
  }

  __notifyApi() {
    return this.apiDeferred.notify(this.__progressInfo())
  }

  __rejectApi(err) {
    this.__progressState = 'error'
    this.__notifyApi()
    return this.apiDeferred.reject(err, this.__fileInfo())
  }

  __resolveApi() {
    this.__progressState = 'ready'
    this.__notifyApi()
    return this.apiDeferred.resolve(this.__fileInfo())
  }

  __cancel() {
    return this.__rejectApi('user')
  }

  __extendApi(api) {
    api.cancel = this.__cancel.bind(this)
    api.pipe = api.then = (...args) => {
      // 'pipe' is alias to 'then' from jQuery 1.8
      return this.__extendApi(fixedPipe(api, ...args))
    }

    return api // extended promise
  }

  promise() {
    var op
    if (!this.__apiPromise) {
      this.__apiPromise = this.__extendApi(this.apiDeferred.promise())
      this.__runValidators()
      if (this.apiDeferred.state() === 'pending') {
        op = this.__startUpload()
        op.done(() => {
          this.__progressState = 'uploaded'
          this.__progress = 1
          this.__notifyApi()
          return this.__completeUpload()
        })
        op.progress(progress => {
          if (progress > this.__progress) {
            this.__progress = progress
            return this.__notifyApi()
          }
        })
        op.fail((error) => {
          return this.__rejectApi(toLabel(error))
        })
        this.apiDeferred.always(op.reject)
      }
    }
    return this.__apiPromise
  }
}

const toLabel = (text) => {
  const map = {
    '`signature` is required.': 'signature' 
  }

  return map[text] || 'upload' 
}

export { BaseFile }
