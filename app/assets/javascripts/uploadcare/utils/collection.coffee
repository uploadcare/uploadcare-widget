import uploadcare from '../namespace.coffee'

{
  jQuery: $
} = uploadcare

uploadcare.namespace 'utils', (utils) ->

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
      @anyDoneList = $.Callbacks()
      @anyFailList = $.Callbacks()
      @anyProgressList = $.Callbacks()
      @_thenArgs = null

      @anyProgressList.add (item, firstArgument) ->
        $(item).data('lastProgress', firstArgument)

      super

    onAnyDone: (cb) =>
      @anyDoneList.add(cb)
      for file in @__items
        if file.state() == 'resolved'
          file.done ->
            cb(file, arguments...)

    onAnyFail: (cb) =>
      @anyFailList.add(cb)
      for file in @__items
        if file.state() == 'rejected'
          file.fail ->
            cb(file, arguments...)

    onAnyProgress: (cb) =>
      @anyProgressList.add(cb)
      for file in @__items
        cb(file, $(file).data('lastProgress'))

    lastProgresses: ->
      for item in @__items
        $(item).data('lastProgress')

    add: (item) ->
      if not (item and item.then)
        return

      if @_thenArgs
        item = item.then(@_thenArgs...)

      super

      @__watchItem(item)

    __replace: (oldItem, newItem, i) ->
      if not (newItem and newItem.then)
        @remove(oldItem)
      else
        super
        @__watchItem(newItem)

    __watchItem: (item) ->
      handler = (callbacks) =>
        =>
          if item in @__items
            callbacks.fire(item, arguments...)

      item.then(
        handler(@anyDoneList),
        handler(@anyFailList),
        handler(@anyProgressList)
      )

    autoThen: ->
      if @_thenArgs
        throw new Error("CollectionOfPromises.then() could be used only once")
      @_thenArgs = arguments
      for item, i in @__items
        @__replace(item, item.then(@_thenArgs...), i)
