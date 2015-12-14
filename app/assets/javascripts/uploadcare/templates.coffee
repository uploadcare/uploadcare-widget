# = require_self
# = require_directory ./templates

{
  locale,
  utils,
  jQuery: $,
} = uploadcare

uploadcare.namespace 'templates', (ns) ->
  ns.JST = {}

  ns.tpl = (key, ctx={}) ->
    fn = ns.JST[key]
    if fn?
      fn($.extend({t: locale.t, utils, uploadcare}, ctx))
    else
      ''
