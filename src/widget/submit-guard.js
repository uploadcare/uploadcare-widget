import $ from 'jquery'
import { isWindowDefined } from '../utils/is-window-defined'

const canSubmit = function(form) {
  var notSubmittable
  notSubmittable = '[data-status=started], [data-status=error]'
  return !form.find('.uploadcare--widget').is(notSubmittable)
}

const submitPreventionState = function(form, prevent) {
  form.attr('data-uploadcare-submitted', prevent)
  return form.find(':submit').attr('disabled', prevent)
}

const uploadForm = '[role~="uploadcare-upload-form"]'
const submittedForm = uploadForm + '[data-uploadcare-submitted]'

if (isWindowDefined()) {
  $(document).on('submit', uploadForm, function() {
    var form
    form = $(this)
    if (canSubmit(form)) {
      return true // allow submit
    } else {
      submitPreventionState(form, true)
      return false
    }
  })

  $(document).on('loaded.uploadcare', submittedForm, function() {
    return $(this).submit()
  })

  const cancelEvents = 'ready.uploadcare error.uploadcare'

  $(document).on(cancelEvents, submittedForm, function() {
    var form
    form = $(this)
    if (canSubmit(form)) {
      return submitPreventionState(form, false)
    }
  })
}
