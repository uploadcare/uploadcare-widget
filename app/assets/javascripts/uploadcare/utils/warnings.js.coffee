{
  namespace,
} = uploadcare

namespace 'uploadcare.utils', (ns) ->

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

    multiupload: 'Sorry, the multiupload is not working now.'

    publicKey: """
      Global public key not set. Uploads may not work!
      Add this to the <head> tag to set your key:

      <script>
      UPLOADCARE_PUBLIC_KEY = 'your_public_key';
      </script>
      """

  ns.commonWarning = (name) ->
    ns.warnOnce(common[name]) if common[name]?
