{
  namespace,
  templates: {tpl}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->
  ns.StaticTabWith = (tplName) ->
    class ns.StaticTab
      constructor: (@container) ->
        @container.append tpl("tab-#{tplName}")
