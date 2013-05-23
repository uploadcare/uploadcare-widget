{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.utils', (utils) ->

  cache = {}
  MAX_ATTEMPTS = 3

  utils.loadPlugin = (filename) ->

    unless cache[filename]

      df = $.Deferred()
      cache[filename] = df.promise()

      uploadcare.settings.waitForSettings null, (settings) ->
        {scriptBase, scriptExt} = settings

        url = "#{scriptBase}plugins/#{filename}#{scriptExt}"

        df.fail ->
          utils.warn "Couldn't load script #{url}"

        attempts = 0
        load = ->
          attempts++
          if attempts > MAX_ATTEMPTS
            df.reject()
          else
            $.getScript(url)
              .done(df.resolve)
              .fail(load)

        load()

    cache[filename]
