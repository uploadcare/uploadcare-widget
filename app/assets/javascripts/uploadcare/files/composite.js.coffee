uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.files', (ns) ->
    class ns.CompositeFile
      constructor: (@files) ->

      upload: (settings) ->
        file.upload(settings) for file in @files

      cancel: ->
        file.cancel(settings) for file in @files

