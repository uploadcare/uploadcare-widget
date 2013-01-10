window.uploadcare ||= new Object

((glob) ->
  glob.namespace = (target, name, block) ->
    [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
    top    = target
    target = target[item] or= {} for item in name.split '.'
    block target, top

  glob.extend = (obj, mixin) ->
    for name, method of mixin
      obj[name] = method

  glob.include = (klass, mixin) ->
    glob.extend klass.prototype, mixin
) window.uploadcare
