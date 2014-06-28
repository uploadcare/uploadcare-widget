# = require_directory ./templates

{
  namespace,
  locale,
  utils,
  jQuery: $,
} = uploadcare

namespace 'uploadcare.templates', (ns) ->
  ns.tpl = (key, ctx={}) ->
    fn = JST["uploadcare/templates/#{key}"]
    if fn?
      fn($.extend({t: locale.t, utils}, ctx))
    else
      ''
