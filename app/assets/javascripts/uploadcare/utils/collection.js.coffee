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
      @add(item) for item in items

    add: (item) ->
      @__items.push(item)
      @onAdd.fire(item)

    remove: (item) ->
      if utils.remove(@__items, item)
        @onRemove.fire(item)

    clear: ->
      @remove(item) for item in @get()

    replace: (oldItem, newItem) ->
      unless oldItem is newItem
        for item, i in @__items
          if item is oldItem
            @__replace oldItem, newItem, i

    __replace: (oldItem, newItem, i) ->
      @__items[i] = newItem
      @onReplaced.fire oldItem, newItem, i

    sort: (comparator) ->
      @__items.sort comparator
      @onSorted.fire()

    get: (index) ->
      if index?
        @__items[index]
      else
        @__items.slice(0)

    length: ->
      @__items.length

    readOnly: ->
      utils.bindAll this, [
        'get'
        'length'
        'onAdd'
        'onRemove'
      ]


  class utils.UniqCollection extends utils.Collection

    add: (item) ->
      return if item in @__items
      super

    __replace: (oldItem, newItem, i) ->
      if newItem in @__items
        @remove oldItem
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
      $(item).data('lastProgress') for item in @__items

    add: (item) ->
      unless item and item.done and item.fail and item.then
        return

      super

      @__watchItem item

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
      unless newItem and newItem.done and newItem.fail and newItem.then
        @remove oldItem
      else
        super

        @__watchItem newItem

    readOnly: ->
      $.extend super(), utils.bindAll this, [
        'onAnyDone'
        'onAnyFail'
        'onAnyProgress'
        'lastProgresses'
      ]
