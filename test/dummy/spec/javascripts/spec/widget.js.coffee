{
  mocks
  utils
  fixtures:
    fileInfo: {kitty}
} = jasmine

$ ->
  describe 'uploadcare.Widget() should', ->


    loadFixtures('widget-input')
    widget = uploadcare.Widget('#widget-input')

    it 'retutn an object', ->
      expect(widget).toEqual jasmine.any(Object)

    it 'that have `value()` method', ->
      expect(widget.value).toEqual jasmine.any(Function)

    describe 'After `widget.value(%uuid%)` call', ->

      mocks.use 'uploadcareFile'

      file = null

      it '`widget.value()` should return some File', ->

        widget.value kitty.uuid
        file = widget.value()

        expect(uploadcare.utils.isFile file).toBeTruthy()

      it 'with correct info', ->

        file.done (info) ->
          for prop in ['uuid', 'name', 'size', 'isImage', 'isStored']
            expect(info[prop]).toBe utils.toFileInfo(kitty)[prop]




