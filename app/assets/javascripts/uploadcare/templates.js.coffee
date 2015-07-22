
{
  namespace,
  locale,
  utils,
  jQuery: $,
} = uploadcare

namespace 'uploadcare.templates', (ns) ->
  ns.JST = {}

  ns.tpl = (key, ctx={}) ->
    fn = ns.JST["uploadcare/templates/#{key}"]
    if fn?
      fn($.extend({t: locale.t, utils}, ctx))
    else
      ''
