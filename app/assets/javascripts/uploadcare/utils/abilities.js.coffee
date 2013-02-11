uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.utils.abilities', (ns) ->
    ns.canFileAPI = -> !!window.FileList
