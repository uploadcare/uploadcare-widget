import { callbacks } from '../utils'

// utils

class Collection {
  constructor(items = [], after = false) {
    this.onAdd = callbacks()
    this.onRemove = callbacks()
    this.onSort = callbacks()
    this.onReplace = callbacks()
    this.__items = []

    if (!after) {
      this.init(items)
    }
  }

  init(items) {
    var item, j, len
    for (j = 0, len = items.length; j < len; j++) {
      item = items[j]
      this.add(item)
    }
  }

  add(item) {
    return this.__add(item, this.__items.length)
  }

  __add(item, i) {
    this.__items.splice(i, 0, item)
    return this.onAdd.fire(item, i)
  }

  remove(item) {
    var i = this.__items.indexOf(item)
    if (i !== -1) {
      return this.__remove(item, i)
    }
  }

  __remove(item, i) {
    this.__items.splice(i, 1)
    return this.onRemove.fire(item, i)
  }

  clear() {
    const items = this.get()
    this.__items.length = 0

    for (let i = 0, j = 0, len = items.length; j < len; i = ++j) {
      const item = items[i]
      this.onRemove.fire(item, i)
    }
  }

  replace(oldItem, newItem) {
    if (oldItem !== newItem) {
      var i = this.__items.indexOf(oldItem)
      if (i !== -1) {
        return this.__replace(oldItem, newItem, i)
      }
    }
  }

  __replace(oldItem, newItem, i) {
    this.__items[i] = newItem
    return this.onReplace.fire(oldItem, newItem, i)
  }

  sort(comparator) {
    this.__items.sort(comparator)
    return this.onSort.fire()
  }

  get(index) {
    if (index != null) {
      return this.__items[index]
    } else {
      return this.__items.slice(0)
    }
  }

  length() {
    return this.__items.length
  }
}

class UniqCollection extends Collection {
  add(item) {
    if (this.__items.indexOf(item) >= 0) {
      return
    }
    return super.add(...arguments)
  }

  __replace(oldItem, newItem, i) {
    if (this.__items.indexOf(newItem) >= 0) {
      return this.remove(oldItem)
    } else {
      return super.__replace(...arguments)
    }
  }
}

class CollectionOfPromises extends UniqCollection {
  constructor() {
    super(...arguments, true)

    this.anyDoneList = callbacks()
    this.anyFailList = callbacks()
    this.anyProgressList = callbacks()

    this._thenArgs = null

    super.init(arguments[0])

    this._lastProgress = []
    this.anyProgressList.add((item, firstArgument) => {
      const index = this.__items.indexOf(item)
      if (index >= 0) {
        this._lastProgress[index] = firstArgument
      }
    })
  }

  onAnyDone(cb) {
    var file, j, len, ref1, results

    this.anyDoneList.add(cb)
    ref1 = this.__items
    results = []
    for (j = 0, len = ref1.length; j < len; j++) {
      file = ref1[j]
      if (file.state() === 'resolved') {
        results.push(
          file.done(function(...args) {
            return cb(file, ...args)
          })
        )
      } else {
        results.push(undefined)
      }
    }
    return results
  }

  onAnyFail(cb) {
    var file, j, len, ref1, results

    this.anyFailList.add(cb)
    ref1 = this.__items
    results = []
    for (j = 0, len = ref1.length; j < len; j++) {
      file = ref1[j]
      if (file.state() === 'rejected') {
        results.push(
          file.fail(function(...args) {
            return cb(file, ...args)
          })
        )
      } else {
        results.push(undefined)
      }
    }
    return results
  }

  onAnyProgress(cb) {
    this.anyProgressList.add(cb)

    for (let j = 0, len = this.__items.length; j < len; j++) {
      const file = this.__items[j]
      const lastProgress = this._lastProgress[j] || {}
      cb(file, lastProgress)
    }
  }

  lastProgresses() {
    return this.__items.map((_, index) => {
      const progress = this._lastProgress[index]
      if (progress) {
        return progress
      }

      return {}
    })
  }

  add(item) {
    if (!(item && item.then)) {
      return
    }
    if (this._thenArgs) {
      item = item.then(...this._thenArgs)
    }

    super.add(item)
    return this.__watchItem(item)
  }

  __replace(oldItem, newItem, i) {
    if (!(newItem && newItem.then)) {
      return this.remove(oldItem)
    } else {
      super.__replace(...arguments)
      return this.__watchItem(newItem)
    }
  }

  __watchItem(item) {
    var handler = callbacks => {
      return (...args) => {
        if (this.__items.indexOf(item) >= 0) {
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

  autoThen(...args) {
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

export { Collection, UniqCollection, CollectionOfPromises }
