{
  namespace,
  templates: {tpl}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->
  class ns.StaticTab
    constructor: (@container) ->
      @container.append tpl("tab-#{@name}")
