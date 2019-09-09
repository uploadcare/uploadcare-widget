import uploadcare from '../namespace'

uploadcare.namespace('utils', function (ns) {
  ns.log = function () {
    var ref
    try {
      return (ref = window.console) != null ? typeof ref.log === 'function' ? ref.log(...arguments) : undefined : undefined
    } catch (error) {}
  }

  ns.debug = function () {
    var ref
    if ((ref = window.console) != null ? ref.debug : undefined) {
      try {
        return window.console.debug(...arguments)
      } catch (error) {}
    } else {
      return ns.log('Debug:', ...arguments)
    }
  }

  ns.warn = function () {
    var ref
    if ((ref = window.console) != null ? ref.warn : undefined) {
      try {
        return window.console.warn(...arguments)
      } catch (error) {}
    } else {
      return ns.log('Warning:', ...arguments)
    }
  }

  const messages = {}
  ns.warnOnce = function (msg) {
    if (messages[msg] == null) {
      messages[msg] = true
      return ns.warn(msg)
    }
  }
})
