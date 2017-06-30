const jsdom = require('mocha-jsdom')
const assert = require('assert')

describe('uploadcare full', function() {
  let uploadcare

  jsdom()

  before(() => {
    uploadcare = require('../pkg/latest/uploadcare.full')
  })

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
