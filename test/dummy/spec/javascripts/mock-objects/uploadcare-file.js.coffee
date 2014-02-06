{
  mocks
  utils
  fixtures:
    fileInfo: {kitty}
} = jasmine

mocks.define 'uploadcareFile', ->

  scenarios =
    fastUploaded: ->
      @resolve()
    fastFailed: ->
      @reject 'info'

  class FakeFile

    constructor: (@settings, @type, @data, fixture=kitty) ->
      @df = $.Deferred()
      @pr = @df.promise()
      @pr.cancel = ->

      $.extend this, utils.toFileProperties fixture
      @progressState = 'uploading'
      @progress = 0

    promise: -> @pr

    __fileInfo: ->
      uuid: @fileId
      name: @fileName
      size: @fileSize
      isStored: @isStored
      isImage: @isImage
      cdnUrl: "#{@settings.cdnBase}/#{@fileId}/#{@cdnUrlModifiers or ''}"
      cdnUrlModifiers: @cdnUrlModifiers
      originalUrl: @originalUrl

    __progressInfo: ->
      state: @progressState
      uploadProgress: @progress
      progress: if @progressState in ['ready', 'error'] then 1 else @progress * 0.9
      incompleteFileInfo: @__fileInfo()

    notify: =>
      @df.notify @__progressInfo()

    reject: (err) =>
      @progress = 1
      @progressState = 'error'
      @notify()
      @df.reject err, @__fileInfo()

    resolve: =>
      @progressState = 'ready'
      @notify()
      @df.resolve @__fileInfo()

    playScenario: (name, options) ->
      scenarios[name].call this, options
      this

  transformer = defaultTransformer = (file) ->
    file.playScenario('fastUploaded')

  fakeFilesFrom = (type, data, settings = {}) ->
    settings = uploadcare.settings.build settings
    file = transformer new FakeFile(settings, type, data)
    [file.promise()]

  origFilesFrom = uploadcare.filesFrom

  turnOn: ->
    uploadcare.filesFrom = fakeFilesFrom

  turnOff: ->
    transformer = defaultTransformer
    uploadcare.filesFrom = origFilesFrom

  onNewFile: (fn) ->
    transformer = fn

  FakeFile: FakeFile
