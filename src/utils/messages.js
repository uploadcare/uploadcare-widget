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
        if (
          e.source === item.sender &&
          (item.origin == null || e.origin === item.origin)
        ) {
          results.push(item.callback(message))
        } else {
          results.push(undefined)
        }
      }
      return results
    }
  })

// `origin` is optional. When given, a message must come from that exact
// origin in addition to coming from the registered sender window.
const registerMessage = function (type, sender, callback, origin) {
  if (!(type in callbacks)) {
    callbacks[type] = []
  }

  return callbacks[type].push({ sender, callback, origin })
}

const unregisterMessage = function (type, sender) {
  if (type in callbacks) {
    callbacks[type] = $.grep(callbacks[type], function (item) {
      return item.sender !== sender
    })

    return callbacks[type]
  }
}

export { registerMessage, unregisterMessage }
