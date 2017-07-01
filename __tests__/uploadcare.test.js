const assert = require('assert')
const uploadcare = require('../pkg/latest/uploadcare')

describe('uploadcare', function() {
  it('has version', () => {
    assert.equal(typeof uploadcare.version, 'string')
  })

  it('create widget', () => {
    document.body.innerHTML = '<input role="uploadcare-uploader" type="hidden">'

    uploadcare.initialize()

    const $widget = document.body.querySelector('.uploadcare--widget')

    assert.equal($widget !== null, true)
  })
})
