import uploadcare from '../namespace'

{
  jQuery: $
} = uploadcare

canSubmit = (form) ->
  notSubmittable = '[data-status=started], [data-status=error]'
  not form.find('.uploadcare--widget').is(notSubmittable)

submitPreventionState = (form, prevent) ->
  form.attr('data-uploadcare-submitted', prevent)
  form.find(':submit').attr('disabled', prevent)

uploadForm = '[role~="uploadcare-upload-form"]'
submittedForm = uploadForm + '[data-uploadcare-submitted]'

$(document).on 'submit', uploadForm, ->
  form = $(this)
  if canSubmit(form)
    true # allow submit
  else
    submitPreventionState(form, true)
    false

$(document).on 'loaded.uploadcare', submittedForm, ->
  $(this).submit()

cancelEvents = 'ready.uploadcare error.uploadcare'
$(document).on cancelEvents, submittedForm, ->
  form = $(this)
  if canSubmit(form)
    submitPreventionState(form, false)
