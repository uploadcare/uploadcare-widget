# = require application

$ ->
  describe 'uploadcare.MultipleWidget() should', ->
    loadFixtures('multiple-widget-input')
    multipleWidget = uploadcare.MultipleWidget('#multiple-widget-input')
    
    it 'retutn an object', ->
      expect(multipleWidget).not.toBe(null)

    it 'that have `value()` method', ->
      expect(typeof multipleWidget.value).toBe('function')

  describe """
    If uploadcare.MultipleWidget() was called 
    with element without data-multiple
  """, ->
    loadFixtures('widget-input')
    
    it 'an exception should be thrown', ->
      expect(-> uploadcare.MultipleWidget '#widget-input').toThrow()
