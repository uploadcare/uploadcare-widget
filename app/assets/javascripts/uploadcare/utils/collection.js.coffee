{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.utils', (utils) ->

  class utils.Collection

    constructor: (items = []) ->
      @onAdd = $.Callbacks()
      @onRemove = $.Callbacks()
      @onSort = $.Callbacks()
      @onReplace = $.Callbacks()

      @__items = []
      for item in items
        @add(item)

    add: (item) ->
      @__add(item, @__items.length)

    __add: (item, i) ->
      @__items.splice(i, 0, item)
      @onAdd.fire(item, i)

    remove: (item) ->
      i = $.inArray(item, @__items)
      if i isnt -1
        @__remove(item, i)

    __remove: (item, i) ->
      @__items.splice(i, 1)
      @onRemove.fire(item, i)

    clear: ->
      items = @get()
      @__items.length = 0
      for item, i in items
        @onRemove.fire(item, i)

    replace: (oldItem, newItem) ->
      if oldItem isnt newItem
        i = $.inArray(oldItem, @__items)
        if i isnt -1
          @__replace(oldItem, newItem, i)

    __replace: (oldItem, newItem, i) ->
      @__items[i] = newItem
      @onReplace.fire(oldItem, newItem, i)

    sort: (comparator) ->
      @__items.sort(comparator)
      @onSort.fire()

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
