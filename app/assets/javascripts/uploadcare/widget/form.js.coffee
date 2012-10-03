uploadcare.whenReady ->
  {
    namespace,
    initialize,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget', (ns) ->
    class ns.Form
      constructor: (@element) ->
        @element.on('submit', @__submit)

      __submit: =>
        # TODO Handle submit denial visualy here
        not $('.uploadcare-widget', @element).is('.started, .error')

    initialize class: ns.Form, elements: 'form:has(@uploadcare-uploader)'
