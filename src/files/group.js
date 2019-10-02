import uploadcare from '../namespace'

import { CollectionOfPromises } from '../utils/collection'
import { log } from '../utils/warnings'

const {
  namespace,
  jQuery: $,
  utils,
  locale: { t },
  settings: s,
  files: ucFiles
} = uploadcare

namespace('files', function (ns) {
  ns.FileGroup = class FileGroup {
    constructor (files, settings) {
      this.__uuid = null
      this.settings = s.build(settings)
      this.__fileColl = new CollectionOfPromises(files)
      this.__allFilesDf = $.when(...this.files())
      this.__fileInfosDf = (() => {
        var file
        files = (function () {
          var j, len, ref, results
          ref = this.files()
          results = []
          for (j = 0, len = ref.length; j < len; j++) {
            file = ref[j]
            // eslint-disable-next-line handle-callback-err
            results.push(file.then(null, function (err, info) {
              return $.when(info)
            }))
          }
          return results
        }.call(this))
        return $.when(...files)
      })()
      this.__createGroupDf = $.Deferred()
      this.__initApiDeferred()
    }

    files () {
      return this.__fileColl.get()
    }

    __save () {
      if (!this.__saved) {
        this.__saved = true
        return this.__allFilesDf.done(() => {
          return this.__createGroup().done((groupInfo) => {
            this.__uuid = groupInfo.id
            return this.__buildInfo((info) => {
              if (this.settings.imagesOnly && !info.isImage) {
                return this.__createGroupDf.reject('image', info)
              } else {
                return this.__createGroupDf.resolve(info)
              }
            })
          }).fail(() => {
            return this.__createGroupDf.reject('createGroup')
          })
        })
      }
    }

    // returns object similar to File object
    promise () {
      this.__save()
      return this.__apiDf.promise()
    }

    __initApiDeferred () {
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
      this.__allFilesDf.done(() => {
        this.__progressState = 'uploaded'
        return notify()
      }).fail(reject)
      return this.__createGroupDf.done((info) => {
        this.__progressState = 'ready'
        notify()
        return resolve(info)
      }).fail(reject)
    }

    __progressInfo () {
      var j, len, progress, progressInfo, progressInfos
      progress = 0
      progressInfos = this.__fileColl.lastProgresses()
      for (j = 0, len = progressInfos.length; j < len; j++) {
        progressInfo = progressInfos[j]
        progress += ((progressInfo != null ? progressInfo.progress : undefined) || 0) / progressInfos.length
      }
      return {
        state: this.__progressState,
        uploadProgress: progress,
        progress: this.__progressState === 'ready' ? 1 : progress * 0.9
      }
    }

    __buildInfo (cb) {
      var info
      info = {
        uuid: this.__uuid,
        cdnUrl: this.__uuid ? `${this.settings.cdnBase}/${this.__uuid}/` : null,
        name: t('file', this.__fileColl.length()),
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

    __createGroup () {
      var df
      df = $.Deferred()
      if (this.__fileColl.length()) {
        this.__fileInfosDf.done((...infos) => {
          var info
          return utils.jsonp(`${this.settings.urlBase}/group/`, 'POST', {
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
          }, {
            headers: {
              'X-UC-User-Agent': this.settings._userAgent
            }
          }).fail((reason) => {
            if (this.settings.debugUploads) {
              log("Can't create group.", this.settings.publicKey, reason)
            }
            return df.reject()
          }).done(df.resolve)
        })
      } else {
        df.reject()
      }
      return df.promise()
    }

    api () {
      if (!this.__api) {
        this.__api = utils.bindAll(this, ['promise', 'files'])
      }
      return this.__api
    }
  }

  ns.SavedFileGroup = class SavedFileGroup extends ns.FileGroup {
    constructor (data, settings) {
      var files
      files = uploadcare.filesFrom('ready', data.files, settings)
      super(files, settings)
      this.__data = data
    }

    __createGroup () {
      return utils.wrapToPromise(this.__data)
    }
  }
})

namespace('', function (ns) {
  ns.FileGroup = function (filesAndGroups = [], settings) {
    var file, files, item, j, k, len, len1, ref
    files = []
    for (j = 0, len = filesAndGroups.length; j < len; j++) {
      item = filesAndGroups[j]
      if (utils.isFile(item)) {
        files.push(item)
      } else if (utils.isFileGroup(item)) {
        ref = item.files()
        for (k = 0, len1 = ref.length; k < len1; k++) {
          file = ref[k]
          files.push(file)
        }
      }
    }
    return new ucFiles.FileGroup(files, settings).api()
  }

  ns.loadFileGroup = function (groupIdOrUrl, settings) {
    var df, id
    settings = s.build(settings)
    df = $.Deferred()
    id = utils.groupIdRegex.exec(groupIdOrUrl)
    if (id) {
      utils.jsonp(`${settings.urlBase}/group/info/`, 'GET', {
        jsonerrors: 1,
        pub_key: settings.publicKey,
        group_id: id[0]
      }, {
        headers: {
          'X-UC-User-Agent': settings._userAgent
        }
      }).fail((reason) => {
        if (settings.debugUploads) {
          log("Can't load group info. Probably removed.", id[0], settings.publicKey, reason)
        }
        return df.reject()
      }).done(function (data) {
        var group
        group = new ucFiles.SavedFileGroup(data, settings)
        return df.resolve(group.api())
      })
    } else {
      df.reject()
    }
    return df.promise()
  }
})

namespace('utils', function (utils) {
  utils.isFileGroup = function (obj) {
    return obj && obj.files && obj.promise
  }
  // Converts user-given value to FileGroup object.
  utils.valueToGroup = function (value, settings) {
    var files, item
    if (value) {
      if ($.isArray(value)) {
        files = (function () {
          var j, len, results
          results = []
          for (j = 0, len = value.length; j < len; j++) {
            item = value[j]
            results.push(utils.valueToFile(item, settings))
          }
          return results
        })()
        value = uploadcare.FileGroup(files, settings)
      } else {
        if (!utils.isFileGroup(value)) {
          return uploadcare.loadFileGroup(value, settings)
        }
      }
    }
    return utils.wrapToPromise(value || null)
  }

  // check if two groups contains same files in same order
  utils.isFileGroupsEqual = function (group1, group2) {
    var file, files1, files2, i, j, len
    if (group1 === group2) {
      return true
    }
    if (!(utils.isFileGroup(group1) && utils.isFileGroup(group2))) {
      return false
    }
    files1 = group1.files()
    files2 = group2.files()
    if (files1.length !== files2.length) {
      return false
    }
    for (i = j = 0, len = files1.length; j < len; i = ++j) {
      file = files1[i]
      if (file !== files2[i]) {
        return false
      }
    }
    return true
  }
})
