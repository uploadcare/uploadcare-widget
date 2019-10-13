import $ from 'jquery'

var indexOf = [].indexOf

// utils

class Collection {
  constructor (items = [], after = false) {
    this.onAdd = $.Callbacks()
    this.onRemove = $.Callbacks()
    this.onSort = $.Callbacks()
    this.onReplace = $.Callbacks()
    this.__items = []

    if (!after) {
      this.init(items)
    }
  }

  init (items) {
    var item, j, len
    for (j = 0, len = items.length; j < len; j++) {
      item = items[j]
      this.add(item)
    }
  }

  add (item) {
    return this.__add(item, this.__items.length)
  }

  __add (item, i) {
    this.__items.splice(i, 0, item)
    return this.onAdd.fire(item, i)
  }

  remove (item) {
    var i
    i = $.inArray(item, this.__items)
    if (i !== -1) {
      return this.__remove(item, i)
    }
  }

  __remove (item, i) {
    this.__items.splice(i, 1)
    return this.onRemove.fire(item, i)
  }

  clear () {
    var i, item, items, j, len, results
    items = this.get()
    this.__items.length = 0
    results = []
    for (i = j = 0, len = items.length; j < len; i = ++j) {
      item = items[i]
      results.push(this.onRemove.fire(item, i))
    }
    return results
  }

  replace (oldItem, newItem) {
    var i
    if (oldItem !== newItem) {
      i = $.inArray(oldItem, this.__items)
      if (i !== -1) {
        return this.__replace(oldItem, newItem, i)
      }
    }
  }

  __replace (oldItem, newItem, i) {
    this.__items[i] = newItem
    return this.onReplace.fire(oldItem, newItem, i)
  }

  sort (comparator) {
    this.__items.sort(comparator)
    return this.onSort.fire()
  }

  get (index) {
    if (index != null) {
      return this.__items[index]
    } else {
      return this.__items.slice(0)
    }
  }

  length () {
    return this.__items.length
  }
}

class UniqCollection extends Collection {
  add (item) {
    if (indexOf.call(this.__items, item) >= 0) {
      return
    }
    return super.add(...arguments)
  }

  __replace (oldItem, newItem, i) {
    if (indexOf.call(this.__items, newItem) >= 0) {
      return this.remove(oldItem)
    } else {
      return super.__replace(...arguments)
    }
  }
}

class CollectionOfPromises extends UniqCollection {
  constructor () {
    super(...arguments, true)

    this.anyDoneList = $.Callbacks()
    this.anyFailList = $.Callbacks()
    this.anyProgressList = $.Callbacks()

    this._thenArgs = null
    this.anyProgressList.add(function (item, firstArgument) {
      return $(item).data('lastProgress', firstArgument)
    })

    super.init(arguments[0])
  }

  onAnyDone (cb) {
    var file, j, len, ref1, results

    this.anyDoneList.add(cb)
    ref1 = this.__items
    results = []
    for (j = 0, len = ref1.length; j < len; j++) {
      file = ref1[j]
      if (file.state() === 'resolved') {
        results.push(file.done(function (...args) {
          return cb(file, ...args)
        }))
      } else {
        results.push(undefined)
      }
    }
    return results
  }

  onAnyFail (cb) {
    var file, j, len, ref1, results

    this.anyFailList.add(cb)
    ref1 = this.__items
    results = []
    for (j = 0, len = ref1.length; j < len; j++) {
      file = ref1[j]
      if (file.state() === 'rejected') {
        results.push(file.fail(function (...args) {
          return cb(file, ...args)
        }))
      } else {
        results.push(undefined)
      }
    }
    return results
  }

  onAnyProgress (cb) {
    var file, j, len, ref1, results

    this.anyProgressList.add(cb)
    ref1 = this.__items
    results = []
    for (j = 0, len = ref1.length; j < len; j++) {
      file = ref1[j]
      results.push(cb(file, $(file).data('lastProgress')))
    }
    return results
  }

  lastProgresses () {
    var item, j, len, ref1, results
    ref1 = this.__items
    results = []
    for (j = 0, len = ref1.length; j < len; j++) {
      item = ref1[j]
      results.push($(item).data('lastProgress'))
    }
    return results
  }

  add (item) {
    if (!(item && item.then)) {
      return
    }
    if (this._thenArgs) {
      item = item.then(...this._thenArgs)
    }
    super.add(...arguments)
    return this.__watchItem(item)
  }

  __replace (oldItem, newItem, i) {
    if (!(newItem && newItem.then)) {
      return this.remove(oldItem)
    } else {
      super.__replace(...arguments)
      return this.__watchItem(newItem)
    }
  }

  __watchItem (item) {
    var handler = (callbacks) => {
      return (...args) => {
        if (indexOf.call(this.__items, item) >= 0) {
          return callbacks.fire(item, ...args)
        }
      }
    }

    return item.then(
      handler(this.anyDoneList),
      handler(this.anyFailList),
      handler(this.anyProgressList)
    )
  }

  autoThen (...args) {
    var i, item, j, len, ref1, results

    if (this._thenArgs) {
      throw new Error('CollectionOfPromises.then() could be used only once')
    }

    this._thenArgs = args
    ref1 = this.__items
    results = []
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      item = ref1[i]
      results.push(this.__replace(item, item.then(...this._thenArgs), i))
    }

    return results
  }
}

export {
  Collection,
  UniqCollection,
  CollectionOfPromises
}
