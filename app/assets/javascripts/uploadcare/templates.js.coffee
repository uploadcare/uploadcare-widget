# = require_directory ./templates

{
  namespace,
  locale,
  utils
} = uploadcare

namespace 'uploadcare.templates', (ns) ->
  ns.tpl = (key, ctx={}) ->
    if uploadcare.settings.common().customWidget
      if key is "circle" or key is "widget-button" or key is "widget-file-name" or key is "widget"
        ''
      else
        fn = JST["uploadcare/templates/#{key}"]
        if fn?
          ctx.t = locale.t
          ctx.utils = utils
          fn(ctx)
        else
          ''
    else
      fn = JST["uploadcare/templates/#{key}"]
      if fn?
        ctx.t = locale.t
        ctx.utils = utils
        fn(ctx)
      else
        ''
