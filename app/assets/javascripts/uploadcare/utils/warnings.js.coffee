{
  namespace,
} = uploadcare

namespace 'uploadcare.utils', (ns) ->

  ns.log = (msg) ->
    if console and console.log
      console.log msg

  ns.warn = (msg) ->
    if console and console.warn
      console.warn msg
    else
      ns.log msg

  messages = {}
  ns.warnOnce = (msg) ->
    unless messages[msg]?
      messages[msg] = true
      ns.warn(msg)

  common =
    autostore: """
      You have enabled autostore in the widget, but not on the server.
      To use autostore, make sure it's enabled in project settings.

      https://uploadcare.com/accounts/settings/
      """

    publicKey: """
      Global public key not set. Uploads may not work!
      Add this to the <head> tag to set your key:

      <script>
      UPLOADCARE_PUBLIC_KEY = 'your_public_key';
      </script>
      """

  ns.commonWarning = (name) ->
    ns.warnOnce(common[name]) if common[name]?
