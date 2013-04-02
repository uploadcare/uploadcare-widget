uploadcare.namespace 'uploadcare.utils', (utils) ->

  class utils.Collection 

    constructor: (@__items = []) ->
      @onAdd = $.Callbacks()
      @onRemove = $.Callbacks()

    add: (item) ->
      @__items.push(item)
      @onAdd.fire(item)

    remove: (item) ->
      if utils.remove(@__items, item)
        @onRemove.fire(item)

    clear: ->
      @remove(item) for item in @get()

    get: (i) ->
      if i is undefined
        @__items.slice(0)
      else
        @__items[i]

    length: ->
      @__items.length



      
