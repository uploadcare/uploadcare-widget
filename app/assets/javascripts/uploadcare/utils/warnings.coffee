uploadcare.namespace 'utils', (ns) ->

  ns.log = () ->
    window.console?.log?(arguments...)

  ns.debug = () ->
    if window.console?.debug
      window.console.debug(arguments...)
    else
      ns.log("Debug:", arguments...)

  ns.warn = () ->
    if window.console?.warn
      window.console.warn(arguments...)
    else
      ns.log("Warning:", arguments...)

  messages = {}
  ns.warnOnce = (msg) ->
    if not messages[msg]?
      messages[msg] = true
      ns.warn(msg)

  common =
    publicKey: """
      Global public key not set. Uploads may not work!
      Add this to the <head> tag to set your key:

      <script>
      UPLOADCARE_PUBLIC_KEY = 'your_public_key';
      </script>
      """

  ns.commonWarning = (name) ->
    if common[name]?
      ns.warnOnce(common[name])
