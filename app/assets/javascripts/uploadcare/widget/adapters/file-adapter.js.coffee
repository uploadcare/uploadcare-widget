uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.FileAdapter extends ns.BaseAdapter
      @registerAs 'file'
      constructor: (@widget) ->
        super @widget
        $(@widget).on 'uploadcare.widget.cancel', => @makeInputs()

        fileButton = @tab.find('@uploadcare-dialog-browse-file')
        utils.fileInput fileButton, (e) =>
          @widget.dialog.close()
          @widget.upload('event', e)
