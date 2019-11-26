import { warn as print } from './logger'

const log = function() {
  if (process.env.NODE_ENV !== 'production') {
    print(
      "Please don't use `log` function.\n" +
        'Support for it will be removed in the next major release.'
    )

    var ref

    try {
      return (ref = window.console) != null
        ? typeof ref.log === 'function'
          ? ref.log(...arguments)
          : undefined
        : undefined
    } catch (error) {}
  }
}

const debug = function() {
  if (process.env.NODE_ENV !== 'production') {
    print(
      "Please don't use `debug` function.\n" +
        'Support for it will be removed in the next major release.'
    )

    var ref

    if ((ref = window.console) != null ? ref.debug : undefined) {
      try {
        return window.console.debug(...arguments)
      } catch (error) {}
    } else {
      return log('Debug:', ...arguments)
    }
  }
}

const warn = function() {
  if (process.env.NODE_ENV !== 'production') {
    print(
      "Please don't use `warn` function.\n" +
        'Support for it will be removed in the next major release.'
    )

    var ref

    if ((ref = window.console) != null ? ref.warn : undefined) {
      try {
        return window.console.warn(...arguments)
      } catch (error) {}
    } else {
      return log('Warning:', ...arguments)
    }
  }
}

const messages = {}
const warnOnce = function(msg) {
  if (process.env.NODE_ENV !== 'production') {
    print(
      "Please don't use `warnOnce` function.\n" +
        'Support for it will be removed in the next major release.'
    )
    if (messages[msg] == null) {
      messages[msg] = true
      return warn(msg)
    }
  }
}

export { log, debug, warn, warnOnce }
