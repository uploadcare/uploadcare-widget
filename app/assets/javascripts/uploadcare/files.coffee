# = require ./files/base.coffee
# = require ./files/object.coffee
# = require ./files/input.coffee
# = require ./files/url.coffee
# = require ./files/uploaded.coffee
# = require ./files/group.coffee

{
  utils,
  jQuery: $,
  files: f,
  settings
} = uploadcare

uploadcare.namespace '', (ns) ->

  ns.fileFrom = (type, data, s) ->
    ns.filesFrom(type, [data], s)[0]


  ns.filesFrom = (type, data, s) ->
    s = settings.build(s or {})

    for param in data
      info = null
      if $.isArray(param)
        info = param[1]
        param = param[0]
      new converters[type](param, s, info).promise()


  converters =
    object: f.ObjectFile
    input: f.InputFile
    url: f.UrlFile
    uploaded: f.UploadedFile
    ready: f.ReadyFile
