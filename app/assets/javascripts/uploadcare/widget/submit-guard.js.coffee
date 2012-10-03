uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget', (ns) ->
    class ns.SubmitGuard
      constructor: (@widget) ->
        @form = @widget.closest('@uploadcare-upload-form')
        @form.on('submit', => @canSubmit())
        @element = @form.find(':submit')

      canSubmit: (widget = @widget) ->
        notSubmittable = '[data-status=started], [data-status=error]'
        not widget.is(notSubmittable)

      enable: ->
        formWidgets = $('.uploadcare-widget', @form)
        @element.attr('disabled', false) if @canSubmit(formWidgets)

      disable: ->
        @element.attr('disabled', true)
