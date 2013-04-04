{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.utils', (utils) ->

  class utils.Collection

    constructor: (items = []) ->
      @onAdd = $.Callbacks()
      @onRemove = $.Callbacks()

      @__items = []
      @add(item) for item in items

    add: (item) ->
      @__items.push(item)
      @onAdd.fire(item)

    remove: (item) ->
      if utils.remove(@__items, item)
        @onRemove.fire(item)

    clear: ->
      @remove(item) for item in @get()

    get: (index) ->
      if index?
        @__items[index]
      else
        @__items.slice(0)

    length: ->
      @__items.length


  class utils.CollectionOfPromises extends utils.Collection

    constructor: ->
      @onAnyDone = $.Callbacks()
      @onAnyFail = $.Callbacks()
      @onAnyProgress = $.Callbacks()

      @onAnyProgress.add (item, firstArgument) ->
        $(item).data('lastProgress', firstArgument)

      super

    lastProgresses: ->
      $(item).data('lastProgress') for item in @__items

    add: (item) ->
      unless item and item.done and item.fail and item.then
        throw new Error('only promises can be added to CollectionOfPromises')

      super

      handler = (callbacks) =>
        (args...) =>
          if item in @__items
            args.unshift(item)
            callbacks.fire(args...)

      item.then(
        handler(@onAnyDone),
        handler(@onAnyFail),
        handler(@onAnyProgress)
      )

