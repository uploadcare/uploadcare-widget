import uploadcare from '../namespace.coffee'

uploadcare.namespace 'utils', (ns) ->

  ns.log = () ->
    try
      window.console?.log?(arguments...)

  ns.debug = () ->
    if window.console?.debug
      try
        window.console.debug(arguments...)
    else
      ns.log("Debug:", arguments...)

  ns.warn = () ->
    if window.console?.warn
      try
        window.console.warn(arguments...)
    else
      ns.log("Warning:", arguments...)

  messages = {}
  ns.warnOnce = (msg) ->
    if not messages[msg]?
      messages[msg] = true
      ns.warn(msg)
