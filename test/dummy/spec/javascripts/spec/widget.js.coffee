{
  mocks
  utils
  fixtures:
    fileInfo: {kitty}
} = jasmine

$ ->
  describe 'uploadcare.SingleWidget() should', ->

    widget = null

    beforeEach ->
      loadFixtures('widget-input')
      widget = uploadcare.SingleWidget('#widget-input')

    it 'retutn an object', ->
      expect(widget).toEqual(jasmine.any(Object))

    it 'that have `value()` method', ->
      expect(widget.value).toEqual(jasmine.any(Function))

    describe 'After `widget.value(%uuid%)` call', ->

      beforeEach ->
        mocks.use('uploadcareFile')

      it '`widget.value()` should return an File with correct info', ->

        widget.value(kitty.uuid)
        file = widget.value()

        expect(uploadcare.utils.isFile(file)).toBeTruthy()

        file.done (info) ->
          for prop in ['uuid', 'name', 'size', 'isImage', 'isStored']
            expect(info[prop]).toBe(utils.toFileInfo(kitty)[prop])

      it 'unless File failed to upload. `widget.value()` should return failed file', ->

        mocks.uploadcareFile.onNewFile (file) ->
          file.playScenario('fastFailed')

        widget.value(kitty.uuid)
        file = widget.value()

        expect(uploadcare.utils.isFile(file)).toBeTruthy()
        expect(file.state()).toBe('rejected')
