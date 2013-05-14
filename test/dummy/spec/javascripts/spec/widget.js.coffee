{
  mocks
  utils
  fixtures:
    fileInfo: {kitty}
} = jasmine

$ ->
  describe 'uploadcare.Widget() should', ->

    widget = null

    beforeEach ->
      loadFixtures('widget-input')
      widget = uploadcare.Widget('#widget-input')

    it 'retutn an object', ->
      expect(widget).toEqual jasmine.any(Object)

    it 'that have `value()` method', ->
      expect(widget.value).toEqual jasmine.any(Function)

    describe 'After `widget.value(%uuid%)` call', ->

      it '`widget.value()` should return an File with correct info', ->

        mocks.use 'uploadcareFile'

        widget.value kitty.uuid
        file = widget.value()

        expect(uploadcare.utils.isFile file).toBeTruthy()

        file.done (info) ->
          for prop in ['uuid', 'name', 'size', 'isImage', 'isStored']
            expect(info[prop]).toBe utils.toFileInfo(kitty)[prop]

      it 'unless File failed to upload. `widget.value()` should return null in that case', ->

        mocks.use 'uploadcareFile'

        mocks.uploadcareFile.onNewFile (file) ->
          file.playScenario 'fastFailed'

        widget.value kitty.uuid

        expect(widget.value()).toBeNull()
