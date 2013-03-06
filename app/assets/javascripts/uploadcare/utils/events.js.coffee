uploadcare.whenReady ->
  {
    namespace
  } = uploadcare

  namespace 'uploadcare.utils', (ns) ->
    ns.eventsMixin =
      on: (name, fn) ->
        @__events ||= {}
        list = @__events[name] ||= []
        list.push(fn)
        this

      once: (name, fn) ->
        @on name, ->
          @off name, fn
          fn.apply(this, arguments)
        this

      off: (name, fn) ->
        unless @__events? && (name? || fn?)
          @__events = {}
          return this

        names = if name? then [name] else (key for own key of @__events)
        for name in names when @__events[name]
          list = []
          if fn?
            for cb in cbs when fn != cb
              list.push(cb)
          @__events[name] = list

        this

      trigger: (name, args...) ->
        cbs = @__events?[name]
        cb.apply(this, args) for cb in cbs if cbs
