{
  mocks
  utils
  fixtures:
    fileInfo: {kitty}
} = jasmine

describe "UploadedFile", ->

  it "should be successfully created with correct file info", ->

    file = null

    runs ->
      mocks.use 'jsonp'
      mocks.jsonp.addHandler /\/info\/$/, (url, data) -> kitty.info

      file = uploadcare.fileFrom('uploaded', kitty.uuid)

    waitsFor ->
      file.state() is 'resolved'
    , "successfuly created", 100

    runs ->
      file.done (info) ->
        for prop in ['uuid', 'name', 'size', 'isImage', 'isStored']
          expect(info[prop]).toBe utils.toFileInfo(kitty)[prop]

  it "should failed to be created if server responded with error", ->

    file = null

    runs ->
      mocks.use 'jsonp'
      mocks.jsonp.addHandler /\/info\/$/, (url, data) ->
        error: 'some error message'

      file = uploadcare.fileFrom('uploaded', kitty.uuid)

    waitsFor ->
      file.state() is 'rejected'
    , "file failed", 100

    runs ->
      file.fail (error) ->
        expect(error).toBe 'info'



describe "UrlFile", ->

  it "should be successfully created with correct file info", ->

    file = null

    runs ->
      mocks.use 'jsonp pusher'

      status =
        status: 'error'

      updateStatus = (newStatus) ->
        status = newStatus
        mocks.pusher.channel('task-status-abc').send status.status, status

      mocks.jsonp.addHandler /\/from_url\/$/, ->
        updateStatus
          status: 'progress'
          total: kitty.info.size
          done: 10
        {token: 'abc'}
      mocks.jsonp.addHandler /\/status\/$/, -> status
      mocks.jsonp.addHandler /\/info\/$/, -> kitty.info

      file = uploadcare.fileFrom('url', 'http://example.com/kitty.jpg')

      setTimeout ->
        updateStatus
          status: 'progress'
          total: kitty.info.size
          done: 70
      , 50

      setTimeout ->
        updateStatus
          status: 'success'
          original_filename: kitty.info.original_filename
          file_id: kitty.uuid
      , 100

    waitsFor ->
      file.state() is 'resolved'
    , "successfuly created", 200

    runs ->
      file.done (info) ->
        for prop in ['uuid', 'name', 'size', 'isImage', 'isStored']
          expect(info[prop]).toBe utils.toFileInfo(kitty)[prop]
