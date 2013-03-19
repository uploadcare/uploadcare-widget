# = require_directory ./templates

{
  namespace,
  locale
} = uploadcare

namespace 'uploadcare.templates', (ns) ->
  ns.tpl = (key, ctx={}) ->
    fn = JST["uploadcare/templates/#{key}"]
    if fn?
      ctx.t = locale.t
      fn(ctx)
    else
      ''
