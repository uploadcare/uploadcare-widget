import $ from 'jquery'
import { isWindowDefined } from './is-window-defined'

// utils

var callbacks = {}

isWindowDefined() &&
  $(window).on('message', ({ originalEvent: e }) => {
    var i, item, len, message, ref, results
    try {
      message = JSON.parse(e.data)
    } catch (error) {
      return
    }
    if (
      (message != null ? message.type : undefined) &&
      message.type in callbacks
    ) {
      ref = callbacks[message.type]
      results = []
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i]
        if (e.source === item[0]) {
          results.push(item[1](message))
        } else {
          results.push(undefined)
        }
      }
      return results
    }
  })

const registerMessage = function(type, sender, callback) {
  if (!(type in callbacks)) {
    callbacks[type] = []
  }

  return callbacks[type].push([sender, callback])
}

const unregisterMessage = function(type, sender) {
  if (type in callbacks) {
    callbacks[type] = $.grep(callbacks[type], function(item) {
      return item[0] !== sender
    })

    return callbacks[type]
  }
}

export { registerMessage, unregisterMessage }
