uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.utils.abilities', (ns) ->
    
    ns.canFileAPI = -> !!window.FileList

    # https://github.com/Modernizr/Modernizr/blob/master/feature-detects/draganddrop.js
    ns.dragAndDrop = do ->
      el = document.createElement("div")
      ("draggable" of el) or ("ondragstart" of el and "ondrop" of el)

    ns.fileDragAndDrop = ns.canFileAPI() && ns.dragAndDrop
