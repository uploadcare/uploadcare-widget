uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget.tabs', (ns) ->

    class ns.BaseFileTab
      constructor: (@dialog, @settings) ->
        @onSelected = $.Callbacks()

      setContent: (content) -> throw new Error('not implemented')
