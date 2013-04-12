{
  namespace,
} = uploadcare

namespace 'uploadcare.utils', (ns) ->

  messages = {}
  ns.warnOnce = (msg) ->
    unless messages[msg]?
      messages[msg] = true
      console.warn(msg)

  common =
    autostore: """
      You have enabled autostore in the widget, but not on the server.
      To use autostore, make sure it's enabled in project settings.

      https://uploadcare.com/accounts/settings/
      """

    publicKey: """
      Global public key not set!
      Falling back to "demopublickey".

      Add this to <head> tag to set your key:
      <meta name="uploadcare-public-key" content="your_public_key">
      """

  ns.commonWarning = (name) ->
    ns.warnOnce(common[name]) if common[name]?
