uploadcare.whenReady ->
  {
    jQuery: $
  } = uploadcare

  canSubmit = (form) ->
    notSubmittable = '[data-status=started], [data-status=error]'
    not form.find('.uploadcare-widget').is(notSubmittable)

  submitPreventionState = (form, prevent) ->
    form.attr('data-uploadcare-submitted', prevent)
    form.find(':submit').attr('disabled', prevent)

  $(document).on 'submit', '@uploadcare-upload-form', ->
    form = $(this)
    if canSubmit form
      true # allow submit
    else
      submitPreventionState(form, true)
      false

  submittedForm = '@uploadcare-upload-form[data-uploadcare-submitted]'
  $(document).on 'uploadcare.uploader.loaded', submittedForm, ->
    $(this).submit()

  cancelEvents = 'uploadcare.uploader.ready uploadcare.uploader.error'
  $(document).on cancelEvents, submittedForm, ->
    form = $(this)
    submitPreventionState(form, false) if canSubmit form
