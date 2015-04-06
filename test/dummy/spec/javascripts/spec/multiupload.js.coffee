$ ->
  describe 'uploadcare.MultipleWidget() should', ->

    multipleWidget = null

    beforeEach ->
      loadFixtures('multiple-widget-input')
      multipleWidget = uploadcare.MultipleWidget('#multiple-widget-input')

    it 'retutn an object', ->
      expect(multipleWidget).toEqual(jasmine.any(Object))

    it 'that have `value()` method', ->
      expect(multipleWidget.value).toEqual(jasmine.any(Function))

  describe """
    If uploadcare.MultipleWidget() was called
    with element without data-multiple
  """, ->

    it 'an exception should be thrown', ->
      loadFixtures('widget-input')
      expect( ->
        uploadcare.MultipleWidget('#widget-input')
      ).toThrow()
