{
  namespace,
  jQuery: $,
  utils
} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.FileGroup

    constructor: (settings) ->
      @settings = utils.buildSettings settings
      @__files = []

      @__uploadDf = $.Deferred()
      @__infoDf = $.Deferred()

      # asSingle() stuff
      @__singleFileDf = $.Deferred()
      @__progressState = 'uploading'
      @__uploadDf.done =>
        @__progressState = 'uploaded'
        @__singleFileDf.notify @__progressInfo()
      @__infoDf.done =>
        @__progressState = 'ready'
        @__singleFileDf.notify @__progressInfo()
        @__singleFileDf.resolve @__fileInfo()
      fail = (err) =>
        @__buildInfo (info) =>
          @__singleFileDf.reject err, info
      @__infoDf.fail fail
      @__uploadDf.fail fail

      @__fileProgresses = {}

    get: ->
      file for file in @__files # returns copy of @__files

    add: (file) ->
      @__files.push file
      file.progress (progressInfo) =>
        @__fileProgresses[file] = progressInfo.progress
        @__singleFileDf.notify @__progressInfo()

    remove: (file) ->
      if (index = files.indexOf(file)) isnt -1
        file.splice(index, 1)
        # TODO unsubsribe progress

    save: ->
      @__finalize()
      @__uploadDf.done ->
        @__createGroup()
          .done (groupInfo) =>
            @__uuid = groupInfo.group_id
            @__buildInfo (info) ->
              if @settings.imagesOnly && !info.isImage
                @__infoDf.reject('image', info)
              else
                @__infoDf.resolve(info)
          .fail =>
            @__infoDf.reject('info')

    # returns object that act like single file
    asSingle: ->
      pr = @__singleFileDf.promise()
      pr.cancel = @__cancel

    __progressInfo: ->
      progress = 0
      for file in @__files
        progress += (@__fileProgresses[file] or 0) / @__files.length
      state: @__progressState
      uploadProgress: progress
      progress: if @__progressState == 'ready' then 1 else progress * 0.9

    __fileInfos: (cb) ->
      $.when(@__files...).then(null, (errorsAndInfos...) ->
        errorAndInfo[1] for errorAndInfo in errorsAndInfos
      ).always cb

    __buildInfo: (cb) ->
      info = 
        fileId: @__uuid
        fileName: @__files.length + ' files' #FIXME
        fileSize: 0
        isImage: true
        isStored: true
      @__fileInfos (infos...) ->
        for info in infos
          info.fileSize += info.fileSize
          info.isImage = false if !info.isImage
          info.isStored = false if !info.isStored
        cb(info)

    __finalize: ->
      unless @__finalized
        @__finalized = true
        @add = @remove = ->
          throw new Error("group can't be changed after save")
        $.when(@__files...)
          .then(@__uploadDf.resolve, @__uploadDf.reject)
        # if one file fails all fails
        @__uploadDf.reject @__cancel

    __cancel: =>
      @__finalize()
      file.cancel() for file in @__files
        

    __createGroup: ->
      # tmp
      return $.when({group_id: '123~4'})

      df = $.Deferred()
      @__fileInfos (infos...) ->
        data =
          pub_key: @settings.publicKey
        for info, i in infos
          data["file_id[#{i}]"] = info.fileId
        $.ajax("#{@settings.urlBase}/group/create/", {data, dataType: 'jsonp'})
          .then(df.resolve, df.reject)
      return df.promise()


