{
  namespace,
  templates: {tpl}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->
  ns.StaticTabWith = (tplName) ->
    class StaticTab
      constructor: (@container) ->
        @container.append tpl("tab-#{tplName}")
