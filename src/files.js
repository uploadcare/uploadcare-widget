import { build } from './settings'

import { ObjectFile } from './files/object'
import { InputFile } from './files/input'
import { UrlFile } from './files/url'
import { UploadedFile, ReadyFile } from './files/uploaded'
import WidgetFile from './file'

var converters = {
  object: ObjectFile,
  input: InputFile,
  url: UrlFile,
  uploaded: UploadedFile,
  ready: ReadyFile
}

const fileFrom = function(type, data, s) {
  return new WidgetFile([data], s)
}

const filesFrom = function(type, data, s) {
  var i, info, len, param, results
  s = build(s || {})
  results = []

  for (i = 0, len = data.length; i < len; i++) {
    param = data[i]

    info = undefined

    if (Array.isArray(param)) {
      info = param[1]
      param = param[0]
    }
    results.push(new converters[type](param, s, info).promise())
  }
  return results
}

export { fileFrom, filesFrom }
