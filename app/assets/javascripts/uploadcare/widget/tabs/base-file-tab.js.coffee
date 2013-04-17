{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->

  class ns.BaseFileTab
    constructor: (@dialog, @filesColl, @settings) ->
      @onSelected = $.Callbacks()
      @onGoToPreview = $.Callbacks()
      @onDone = $.Callbacks()

    setContent: (content) -> throw new Error('not implemented')
