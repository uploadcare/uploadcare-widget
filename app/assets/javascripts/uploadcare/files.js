import uploadcare from './namespace'

const {
  jQuery: $,
  files: f,
  settings
} = uploadcare

uploadcare.namespace('', function (ns) {
  var converters = {
    object: f.ObjectFile,
    input: f.InputFile,
    url: f.UrlFile,
    uploaded: f.UploadedFile,
    ready: f.ReadyFile
  }

  ns.fileFrom = function (type, data, s) {
    return ns.filesFrom(type, [data], s)[0]
  }

  ns.filesFrom = function (type, data, s) {
    var i, info, len, param, results
    s = settings.build(s || {})
    results = []

    for (i = 0, len = data.length; i < len; i++) {
      param = data[i]

      info = undefined

      if ($.isArray(param)) {
        info = param[1]
        param = param[0]
      }
      results.push(new converters[type](param, s, info).promise())
    }
    return results
  }
})
