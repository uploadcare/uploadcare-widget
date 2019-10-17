import { splitCdnUrl } from '../utils'
import { BaseFile } from './base'

class UploadedFile extends BaseFile {
  constructor(fileIdOrUrl) {
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
}

UploadedFile.prototype.sourceName = 'uploaded'

class ReadyFile extends BaseFile {
  constructor(data) {
    super(...arguments)
    if (!data) {
      this.__rejectApi('deleted')
    } else {
      this.fileId = data.uuid
      this.__handleFileData(data)
    }
  }
}

ReadyFile.prototype.sourceName = 'uploaded'

export { UploadedFile, ReadyFile }
