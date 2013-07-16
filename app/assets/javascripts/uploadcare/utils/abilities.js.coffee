uploadcare.namespace 'uploadcare.utils.abilities', (ns) ->

  ns.canFileAPI = !!window.FileList

  # https://github.com/Modernizr/Modernizr/blob/master/feature-detects/draganddrop.js
  ns.dragAndDrop = do ->
    el = document.createElement("div")
    ("draggable" of el) or ("ondragstart" of el and "ondrop" of el)

  # https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas.js
  ns.canvas = do ->
    el = document.createElement("canvas")
    !!(el.getContext && el.getContext('2d'))

  ns.fileDragAndDrop = ns.canFileAPI && ns.dragAndDrop
