import $ from 'jquery'
import { Blob, iOSVersion } from '../utils/abilities'
import { log, debug } from '../utils/warnings'
import { jsonp, taskRunner } from '../utils'
import { shrinkFile } from '../utils/image-processor'

import { BaseFile } from './base'

var _directRunner = null

class ObjectFile extends BaseFile {
  constructor(__file) {
    super(...arguments)
    this.__file = __file
    this.fileName = this.__file.name || 'original'
    this.__notifyApi()
  }

  setFile(file) {
    if (file) {
      this.__file = file
    }
    this.sourceInfo.file = this.__file
    if (!this.__file) {
      return
    }
    this.fileSize = this.__file.size
    this.fileType = this.__file.type || 'application/octet-stream'
    if (this.settings.debugUploads) {
      debug('Use local file.', this.fileName, this.fileType, this.fileSize)
    }
    this.__runValidators()
    return this.__notifyApi()
  }

  __startUpload() {
    var df, ios, resizeShare
    this.apiDeferred.always(() => {
      this.__file = null
      return this.__file
    })
    if (this.__file.size >= this.settings.multipartMinSize && Blob) {
      this.setFile()
      return this.multipartUpload()
    }
    ios = iOSVersion
    if (!this.settings.imageShrink || (ios && ios < 8)) {
      this.setFile()
      return this.directUpload()
    }
    // if @settings.imageShrink
    df = $.Deferred()
    resizeShare = 0.4
    shrinkFile(this.__file, this.settings.imageShrink)
      .progress(function (progress) {
        return df.notify(progress * resizeShare)
      })
      .done(this.setFile.bind(this))
      .fail(() => {
        this.setFile()
        resizeShare = resizeShare * 0.1
        return resizeShare
      })
      .always(() => {
        df.notify(resizeShare)
        return this.directUpload()
          .done(df.resolve)
          .fail(df.reject)
          .progress(function (progress) {
            return df.notify(resizeShare + progress * (1 - resizeShare))
          })
      })
    return df
  }

  __autoAbort(xhr) {
    this.apiDeferred.fail(xhr.abort)
    return xhr
  }

  directRunner(task) {
    if (!_directRunner) {
      _directRunner = taskRunner(this.settings.parallelDirectUploads)
    }
    return _directRunner(task)
  }

  directUpload() {
    var df
    df = $.Deferred()
    if (!this.__file) {
      this.__rejectApi('baddata')
      return df
    }
    if (this.fileSize > 100 * 1024 * 1024) {
      this.__rejectApi('size')
      return df
    }
    this.directRunner((release) => {
      var formData
      df.always(release)
      if (this.apiDeferred.state() !== 'pending') {
        return
      }
      formData = new window.FormData()
      formData.append('UPLOADCARE_PUB_KEY', this.settings.publicKey)
      formData.append('signature', this.settings.secureSignature)
      formData.append('expire', this.settings.secureExpire)
      formData.append(
        'UPLOADCARE_STORE',
        this.settings.doNotStore ? '' : 'auto'
      )
      formData.append('file', this.__file, this.fileName)
      formData.append('file_name', this.fileName)
      formData.append('source', this.sourceInfo.source)
      return this.__autoAbort(
        $.ajax({
          xhr: () => {
            var xhr
            // Naked XHR for progress tracking
            xhr = $.ajaxSettings.xhr()
            if (xhr.upload) {
              xhr.upload.addEventListener(
                'progress',
                (e) => {
                  return df.notify(e.loaded / e.total)
                },
                false
              )
            }
            return xhr
          },
          crossDomain: true,
          type: 'POST',
          url: `${this.settings.urlBase}/base/?jsonerrors=1`,
          headers: {
            'X-UC-User-Agent': this.settings._userAgent
          },
          contentType: false, // For correct boundary string
          processData: false,
          data: formData,
          dataType: 'json',
          error: df.reject,
          success: (data) => {
            if (data != null ? data.file : undefined) {
              this.fileId = data.file
              return df.resolve()
            } else {
              return df.reject()
            }
          }
        })
      )
    })
    return df
  }

  multipartUpload() {
    var df
    df = $.Deferred()
    if (!this.__file) {
      return df
    }
    this.multipartStart()
      .done((data) => {
        return this.uploadParts(data.parts, data.uuid)
          .done(() => {
            return this.multipartComplete(data.uuid)
              .done((data) => {
                this.fileId = data.uuid
                this.__handleFileData(data)
                return df.resolve()
              })
              .fail(df.reject)
          })
          .progress(df.notify)
          .fail(df.reject)
      })
      .fail(df.reject)
    return df
  }

  multipartStart() {
    var data
    data = {
      UPLOADCARE_PUB_KEY: this.settings.publicKey,
      signature: this.settings.secureSignature,
      expire: this.settings.secureExpire,
      filename: this.fileName,
      source: this.sourceInfo.source,
      size: this.fileSize,
      content_type: this.fileType,
      part_size: this.settings.multipartPartSize,
      UPLOADCARE_STORE: this.settings.doNotStore ? '' : 'auto'
    }
    return this.__autoAbort(
      jsonp(
        `${this.settings.urlBase}/multipart/start/?jsonerrors=1`,
        'POST',
        data,
        {
          headers: {
            'X-UC-User-Agent': this.settings._userAgent
          }
        }
      )
    ).fail((reason) => {
      if (this.settings.debugUploads) {
        return log("Can't start multipart upload.", reason, data)
      }
    })
  }

  uploadParts(parts, uuid) {
    var df,
      inProgress,
      j,
      lastUpdate,
      progress,
      ref1,
      submit,
      submittedBytes,
      submittedParts,
      updateProgress
    progress = []
    lastUpdate = Date.now()
    updateProgress = (i, loaded) => {
      var j, len, total
      progress[i] = loaded
      if (Date.now() - lastUpdate < 250) {
        return
      }
      lastUpdate = Date.now()
      total = 0
      for (j = 0, len = progress.length; j < len; j++) {
        loaded = progress[j]
        total += loaded
      }
      return df.notify(total / this.fileSize)
    }
    df = $.Deferred()
    inProgress = 0
    submittedParts = 0
    submittedBytes = 0
    submit = () => {
      var attempts, blob, bytesToSubmit, partNo, retry
      if (submittedBytes >= this.fileSize) {
        return
      }
      bytesToSubmit = submittedBytes + this.settings.multipartPartSize
      if (
        this.fileSize <
        bytesToSubmit + this.settings.multipartMinLastPartSize
      ) {
        bytesToSubmit = this.fileSize
      }
      blob = this.__file.slice(submittedBytes, bytesToSubmit)
      submittedBytes = bytesToSubmit
      partNo = submittedParts
      inProgress += 1
      submittedParts += 1
      attempts = 0
      return (retry = () => {
        if (this.apiDeferred.state() !== 'pending') {
          return
        }
        progress[partNo] = 0
        return this.__autoAbort(
          $.ajax({
            xhr: () => {
              var xhr
              // Naked XHR for progress tracking
              xhr = $.ajaxSettings.xhr()
              xhr.responseType = 'text'
              if (xhr.upload) {
                xhr.upload.addEventListener(
                  'progress',
                  (e) => {
                    return updateProgress(partNo, e.loaded)
                  },
                  false
                )
              }
              return xhr
            },
            url: parts[partNo],
            crossDomain: true,
            type: 'PUT',
            processData: false,
            contentType: this.fileType,
            data: blob,
            error: () => {
              attempts += 1
              if (attempts > this.settings.multipartMaxAttempts) {
                if (this.settings.debugUploads) {
                  log(`Part #${partNo} and file upload is failed.`, uuid)
                }
                return df.reject()
              } else {
                if (this.settings.debugUploads) {
                  debug(`Part #${partNo}(${attempts}) upload is failed.`, uuid)
                }
                return retry()
              }
            },
            success: function () {
              inProgress -= 1
              submit()
              if (!inProgress) {
                return df.resolve()
              }
            }
          })
        )
      })()
    }
    for (
      j = 0, ref1 = this.settings.multipartConcurrency;
      ref1 >= 0 ? j < ref1 : j > ref1;
      ref1 >= 0 ? ++j : --j
    ) {
      submit()
    }
    return df
  }

  multipartComplete(uuid) {
    var data
    data = {
      UPLOADCARE_PUB_KEY: this.settings.publicKey,
      uuid: uuid
    }
    return this.__autoAbort(
      jsonp(
        `${this.settings.urlBase}/multipart/complete/?jsonerrors=1`,
        'POST',
        data,
        {
          headers: {
            'X-UC-User-Agent': this.settings._userAgent
          }
        }
      )
    ).fail((reason) => {
      if (this.settings.debugUploads) {
        return log(
          "Can't complete multipart upload.",
          uuid,
          this.settings.publicKey,
          reason
        )
      }
    })
  }
}

ObjectFile.prototype.sourceName = 'local'

export { ObjectFile }
