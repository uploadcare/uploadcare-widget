/* eslint max-nested-callbacks: ["error", 3] */
const assert = require('assert')
const uploadcare = require('../pkg/latest/uploadcare')

window.UPLOADCARE_PUBLIC_KEY = 'demopublickey'

const bodyHasElement = (selector) => {
  const $el = document.body.querySelector(selector)

  assert.equal($el !== null, true)
}

describe('uploadcare', function() {
  it('has version', () => {
    assert.equal(typeof uploadcare.version, 'string')
  })

  describe('widget', () => {
    it('create widget', () => {
      document.body.innerHTML = '<input role="uploadcare-uploader" type="hidden">'

      uploadcare.initialize()

      bodyHasElement('.uploadcare--widget')
    })

    it('click on widget create dialog', () => {
      const $widget = document.body.querySelector('.uploadcare--widget__button_type_open')

      $widget.click()

      bodyHasElement('.uploadcare--dialog')
    })
  })
})
