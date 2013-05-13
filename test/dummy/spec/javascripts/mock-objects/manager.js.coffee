window.mocks =

  objects: []

  define: (name, callback) ->
    @[name] = @objects[name] = callback()

  use: (names) ->
    for name in names.split ' '
      @objects[name].turnOn()

  clear: ->
    for name, object of @objects
      object.turnOff()


afterEach ->
  mocks.clear()
