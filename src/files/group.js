import $ from 'jquery'

import { CollectionOfPromises } from '../utils/collection'
import { log } from '../utils/warnings'
import { wrapToPromise, bindAll, jsonp } from '../utils'
import { build } from '../settings'
import locale from '../locale'
import { filesFrom } from '../files'

// files
class FileGroup {
  constructor(files, settings) {
    this.__uuid = null
    this.settings = build(settings)
    this.__fileColl = new CollectionOfPromises(files)
    this.__allFilesDf = $.when(...this.files())
    this.__fileInfosDf = (() => {
      var file
      files = function () {
        var j, len, ref, results
        ref = this.files()
        results = []
        for (j = 0, len = ref.length; j < len; j++) {
          file = ref[j]
          results.push(
            // eslint-disable-next-line handle-callback-err
            file.then(null, function (err, info) {
              return $.when(info)
            })
          )
        }
        return results
      }.call(this)
      return $.when(...files)
    })()
    this.__createGroupDf = $.Deferred()
    this.__initApiDeferred()
  }

  files() {
    return this.__fileColl.get()
  }

  __save() {
    if (!this.__saved) {
      this.__saved = true
      return this.__allFilesDf.done(() => {
        return this.__createGroup()
          .done((groupInfo) => {
            this.__uuid = groupInfo.id
            return this.__buildInfo((info) => {
              if (this.settings.imagesOnly && !info.isImage) {
                return this.__createGroupDf.reject('image', info)
              } else {
                return this.__createGroupDf.resolve(info)
              }
            })
          })
          .fail((message, error) => {
            return this.__createGroupDf.reject('createGroup', error)
          })
      })
    }
  }

  // returns object similar to File object
  promise() {
    this.__save()
    return this.__apiDf.promise()
  }

  __initApiDeferred() {
    var notify, reject, resolve
    this.__apiDf = $.Deferred()
    this.__progressState = 'uploading'
    reject = (err) => {
      return this.__buildInfo((info) => {
        return this.__apiDf.reject(err, info)
      })
    }
    resolve = (info) => {
      return this.__apiDf.resolve(info)
    }
    notify = () => {
      return this.__apiDf.notify(this.__progressInfo())
    }
    notify()
    this.__fileColl.onAnyProgress(notify)
    this.__allFilesDf
      .done(() => {
        this.__progressState = 'uploaded'
        return notify()
      })
      .fail(reject)
    return this.__createGroupDf
      .done((info) => {
        this.__progressState = 'ready'
        notify()
        return resolve(info)
      })
      .fail(reject)
  }

  __progressInfo() {
    var j, len, progress, progressInfo, progressInfos
    progress = 0
    progressInfos = this.__fileColl.lastProgresses()
    for (j = 0, len = progressInfos.length; j < len; j++) {
      progressInfo = progressInfos[j]
      progress +=
        ((progressInfo != null ? progressInfo.progress : undefined) || 0) /
        progressInfos.length
    }
    return {
      state: this.__progressState,
      uploadProgress: progress,
      progress: this.__progressState === 'ready' ? 1 : progress * 0.9
    }
  }

  __buildInfo(cb) {
    var info
    info = {
      uuid: this.__uuid,
      cdnUrl: this.__uuid ? `${this.settings.cdnBase}/${this.__uuid}/` : null,
      name: locale.t('file', this.__fileColl.length()),
      count: this.__fileColl.length(),
      size: 0,
      isImage: true,
      isStored: true
    }
    return this.__fileInfosDf.done(function (...infos) {
      var _info, j, len
      for (j = 0, len = infos.length; j < len; j++) {
        _info = infos[j]
        info.size += _info.size
        if (!_info.isImage) {
          info.isImage = false
        }
        if (!_info.isStored) {
          info.isStored = false
        }
      }
      return cb(info)
    })
  }

  __createGroup() {
    var df
    df = $.Deferred()
    if (this.__fileColl.length()) {
      this.__fileInfosDf.done((...infos) => {
        var info
        return jsonp(
          `${this.settings.urlBase}/group/?jsonerrors=1`,
          'POST',
          {
            pub_key: this.settings.publicKey,
            signature: this.settings.secureSignature,
            expire: this.settings.secureExpire,
            files: (function () {
              var j, len, results
              results = []
              for (j = 0, len = infos.length; j < len; j++) {
                info = infos[j]
                results.push(`/${info.uuid}/${info.cdnUrlModifiers || ''}`)
              }
              return results
            })()
          },
          {
            headers: {
              'X-UC-User-Agent': this.settings._userAgent
            }
          }
        )
          .fail((message, error) => {
            if (this.settings.debugUploads) {
              log(
                "Can't create group.",
                this.settings.publicKey,
                message,
                error
              )
            }
            return df.reject(message, error)
          })
          .done(df.resolve)
      })
    } else {
      df.reject()
    }
    return df.promise()
  }

  api() {
    if (!this.__api) {
      this.__api = bindAll(this, ['promise', 'files'])
    }
    return this.__api
  }
}

class SavedFileGroup extends FileGroup {
  constructor(data, settings) {
    var files
    files = filesFrom('ready', data.files, settings)
    super(files, settings)
    this.__data = data
  }

  __createGroup() {
    return wrapToPromise(this.__data)
  }
}

export { FileGroup, SavedFileGroup }
