# = require_directory ./templates

{
  namespace,
  locale,
  utils
} = uploadcare

namespace 'uploadcare.templates', (ns) ->
  ns.tpl = (key, ctx={}) ->
    fn = JST["uploadcare/templates/#{key}"]
    if fn?
      ctx.t = locale.t
      ctx.utils = utils
      fn(ctx)
    else
      ''
