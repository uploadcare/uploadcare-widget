describe "UploadedFile", ->

  it "should be successfully created with correct file info", ->

    mocks.use 'jsonp'
    mocks.jsonp.addHandler /\/info\/$/, (url, data) ->
      original_filename: 'kitty.jpg'
      size: 100
      is_image: true
      is_public: false

    file = uploadcare.fileFrom('uploaded', '11e85a4c-30c2-430b-8fba-1c60a18bded8')

    waitsFor (-> file.state() is 'resolved'), "successfuly created", 100

    runs ->
      file.done (info) ->
        expect(info.uuid).toEqual '11e85a4c-30c2-430b-8fba-1c60a18bded8'
        expect(info.name).toEqual 'kitty.jpg'
        expect(info.size).toEqual 100
        expect(info.isImage).toEqual true
        expect(info.isStored).toEqual false


  it "should failed to be created if server responded with error", ->

    mocks.use 'jsonp'
    mocks.jsonp.addHandler /\/info\/$/, (url, data) ->
      error: 'some error message'

    file = uploadcare.fileFrom('uploaded', '11e85a4c-30c2-430b-8fba-1c60a18bded8')

    waitsFor (-> file.state() is 'rejected'), "file failed", 100

    runs ->
      file.fail (error) ->
        expect(error).toEqual 'info'



describe "UrlFile", ->

  it "should be successfully created with correct file info", ->

    mocks.use 'jsonp pusher'

    status =
      status: 'error'

    updateStatus = (newStatus) ->
      status = newStatus
      mocks.pusher.channel('task-status-abc').send status.status, status

    mocks.jsonp.addHandler /\/from_url\/$/, ->
      updateStatus
        status: 'progress'
        total: 100
        done: 10
      {token: 'abc'}
    mocks.jsonp.addHandler /\/status\/$/, -> status
    mocks.jsonp.addHandler /\/info\/$/, ->
      original_filename: 'kitty.jpg'
      size: 100
      is_image: true
      is_public: false

    file = uploadcare.fileFrom('url', 'http://example.com/kitty.jpg')

    setTimeout ->
      updateStatus
        status: 'progress'
        total: 100
        done: 70
    , 50

    setTimeout ->
      updateStatus
        status: 'success'
        original_filename: 'kitty.jpg'
        file_id: '11e85a4c-30c2-430b-8fba-1c60a18bded8'
    , 100

    waitsFor (-> file.state() is 'resolved'), "successfuly created", 200

    runs ->
      file.done (info) ->
        expect(info.uuid).toEqual '11e85a4c-30c2-430b-8fba-1c60a18bded8'
        expect(info.name).toEqual 'kitty.jpg'
        expect(info.size).toEqual 100
        expect(info.isImage).toEqual true
        expect(info.isStored).toEqual false
