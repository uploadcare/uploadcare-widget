uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.utils.abilities', (ns) ->
    ns.canFileAPI = -> !!window.FileList
    ns.canBind = (fn) ->
      Function.prototype.bind && Function.prototype.bind == fn.bind
