{
  namespace,
  jQuery: $,
  templates: {tpl},
  locale: {t}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->

  class ns.BaseSourceTab
    constructor: (@container, @tabButton, @dialogApi, @settings, @name) ->
      @container.append(tpl('source-tab-base'))
      @wrap = @container.find('.uploadcare-dialog-source-base-wrap')
