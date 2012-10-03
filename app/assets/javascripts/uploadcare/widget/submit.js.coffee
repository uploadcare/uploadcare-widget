uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget', (ns) ->
    class ns.Submit
      constructor: (widget) ->
        @form = widget.closest('@uploadcare-form')
        @form.on('submit', => @canSubmit())
        @element = @form.find(':submit')

      canSubmit: ->
        notSubmittable = '[data-status=started], [data-status=error]'
        not $('.uploadcare-widget', @form).is(notSubmittable)

      enable: ->
        @element.attr('disabled', false) if @canSubmit()

      disable: ->
        @element.attr('disabled', true)
