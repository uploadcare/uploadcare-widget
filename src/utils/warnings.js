// utils

const log = function() {
  var ref
  try {
    return (ref = window.console) != null
      ? typeof ref.log === 'function'
        ? ref.log(...arguments)
        : undefined
      : undefined
  } catch (error) {}
}

const debug = function() {
  var ref
  if ((ref = window.console) != null ? ref.debug : undefined) {
    try {
      return window.console.debug(...arguments)
    } catch (error) {}
  } else {
    return log('Debug:', ...arguments)
  }
}

const warn = function() {
  var ref
  if ((ref = window.console) != null ? ref.warn : undefined) {
    try {
      return window.console.warn(...arguments)
    } catch (error) {}
  } else {
    return log('Warning:', ...arguments)
  }
}

const messages = {}
const warnOnce = function(msg) {
  if (messages[msg] == null) {
    messages[msg] = true
    return warn(msg)
  }
}

export { log, debug, warn, warnOnce }
