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
        notSubmittable = '[data-status=started], [data-status=error]'
        not $('.uploadcare-widget', @element).is(notSubmittable)

    initialize class: ns.Form, elements: 'form:has(@uploadcare-uploader)'
