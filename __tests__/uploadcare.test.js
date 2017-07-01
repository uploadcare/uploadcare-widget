/* eslint max-nested-callbacks: ["error", 3] */
const assert = require('assert')
const jsdom = require('jsdom-global')

const cleanup = jsdom()

const uploadcare = require('../pkg/latest/uploadcare')

window.UPLOADCARE_PUBLIC_KEY = 'demopublickey'

const bodyHasElement = (selector) => {
  const $el = document.querySelector(selector)

  assert.equal($el !== null, true)
}

describe('uploadcare', function() {
  it('has version', () => {
    assert.equal(typeof uploadcare.version, 'string')
  })

  describe('widget', () => {
    it('created by initialize', () => {
      document.body.innerHTML = '<input role="uploadcare-uploader" type="hidden">'

      uploadcare.initialize()

      bodyHasElement('.uploadcare--widget')
    })

    after(() => {
      cleanup()
    })
  })

  describe('API', () => {
    before(() => {
      jsdom()
    })

    it('openDialog create dialog', () => {
      uploadcare.openDialog()

      bodyHasElement('.uploadcare--dialog')
    })
  })
})
