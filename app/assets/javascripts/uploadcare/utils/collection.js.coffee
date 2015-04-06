{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.utils', (utils) ->

  class utils.Collection

    constructor: (items = []) ->
      @onAdd = $.Callbacks()
      @onRemove = $.Callbacks()
      @onReplaced = $.Callbacks()
      @onSorted = $.Callbacks()

      @__items = []
      for item in items
        @add(item)

    add: (item) ->
      @__items.push(item)
      @onAdd.fire(item)

    remove: (item) ->
      if utils.remove(@__items, item)
        @onRemove.fire(item)

    clear: ->
      for item in @get()
        @remove(item)

    replace: (oldItem, newItem) ->
      if not (oldItem is newItem)
        for item, i in @__items
          if item is oldItem
            @__replace(oldItem, newItem, i)

    __replace: (oldItem, newItem, i) ->
      @__items[i] = newItem
      @onReplaced.fire(oldItem, newItem, i)

    sort: (comparator) ->
      @__items.sort(comparator)
      @onSorted.fire()

    get: (index) ->
      if index?
        @__items[index]
      else
        @__items.slice(0)

    length: ->
      @__items.length


  class utils.UniqCollection extends utils.Collection

    add: (item) ->
      if item in @__items
        return
      super

    __replace: (oldItem, newItem, i) ->
      if newItem in @__items
        @remove(oldItem)
      else
        super

  class utils.CollectionOfPromises extends utils.UniqCollection

    constructor: ->
      @onAnyDone = $.Callbacks()
      @onAnyFail = $.Callbacks()
      @onAnyProgress = $.Callbacks()

      @onAnyProgress.add (item, firstArgument) ->
        $(item).data('lastProgress', firstArgument)

      super

    lastProgresses: ->
      for item in @__items
        $(item).data('lastProgress')

    add: (item) ->
      if not (item and item.done and item.fail and item.then)
        return

      super

      @__watchItem(item)

    __watchItem: (item) ->
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

    __replace: (oldItem, newItem, i) ->
      if not (newItem and newItem.done and newItem.fail and newItem.then)
        @remove(oldItem)
      else
        super

        @__watchItem(newItem)
