{mocks} = jasmine

mocks.define 'jsonp', ->

  orig = uploadcare.utils.jsonp
  handlers = []

  respond = (handler, url, data) ->
    df = $.Deferred()
    result = handler.callback(url, data)
    setTimeout ->
      if result.error
        df.reject result.error
      else
        df.resolve result
    , handler.delay
    df.promise()

  handle = (url, data) ->
    for handler in handlers
      if handler.urlRegExp.test(url)
        return respond handler, url, data
    return orig url, data



  turnOn: ->
    uploadcare.utils.jsonp = handle

  turnOff: ->
    handlers = []
    uploadcare.utils.jsonp = orig

  addHandler: (urlRegExp, callback, delay=1) ->
    handlers.push {urlRegExp, callback, delay}
