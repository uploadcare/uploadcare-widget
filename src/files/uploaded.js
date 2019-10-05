import uploadcare from '../namespace'
import { splitCdnUrl } from '../utils'

uploadcare.namespace('files', function (ns) {
  ns.UploadedFile = (function () {
    class UploadedFile extends ns.BaseFile {
      constructor (fileIdOrUrl) {
        var cdnUrl
        super(...arguments)
        cdnUrl = splitCdnUrl(fileIdOrUrl)
        if (cdnUrl) {
          this.fileId = cdnUrl[1]
          if (cdnUrl[2]) {
            this.cdnUrlModifiers = cdnUrl[2]
          }
        } else {
          this.__rejectApi('baddata')
        }
      }
    };

    UploadedFile.prototype.sourceName = 'uploaded'

    return UploadedFile
  }.call(this))

  ns.ReadyFile = (function () {
    class ReadyFile extends ns.BaseFile {
      constructor (data) {
        super(...arguments)
        if (!data) {
          this.__rejectApi('deleted')
        } else {
          this.fileId = data.uuid
          this.__handleFileData(data)
        }
      }
    };

    ReadyFile.prototype.sourceName = 'uploaded'

    return ReadyFile
  }.call(this))
})
