{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.utils', (utils) ->

  cache = {}
  ATTEMPTS = 3

  utils.loadPlugin = (filename) ->

    if cache[filename]
      cache[filename]
    else

    unless cache[filename]

      {scriptBase, scriptExt} = uploadcare.settings.build()
      url = "#{scriptBase}plugins/#{filename}#{scriptExt}"

      df = $.Deferred()
      cache[filename] = df.promise()

      df.fail ->
        utils.warn "Can't load script #{url}"

      attempts = 0
      load = ->
        attempts++
        if attempts > ATTEMPTS
          df.reject()
        else
          $.getScript(url)
            .done(df.resolve)
            .fail(load)

      load()

    cache[filename]
