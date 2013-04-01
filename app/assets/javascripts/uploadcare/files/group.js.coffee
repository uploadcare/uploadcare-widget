{
  namespace,
  jQuery: $,
  utils
} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.FileGroup

    constructor: (settings, files) ->
      @settings = utils.buildSettings settings
      @__files = []

      @__finalized = false

      @onFileAdded = $.Callbacks()
      @onFileRemoved = $.Callbacks()

      @__uploadDf = $.Deferred()
      @__infoDf = $.Deferred()

      @__initAsSingle()

      if files
        @add(file) for file in files

    # check if two groups contains same files in same order
    equal: (group) ->
      filesA = @__files
      filesB = group.get()
      return false if filesA.length isnt filesB.length
      for file, i in filesA
        return false if file isnt filesB[i]
      return true 

    # returns copy of @__files
    get: ->
      file for file in @__files 

    add: (file) ->
      if file
        @__files.push file
        file.progress (progressInfo) =>
          $(file).data('progress', progressInfo.progress)
          @__singleFileDf.notify @__progressInfo()
        @onFileAdded.fire file

    removeAll: ->
      @remove(file) for file in @__files

    # creates copy of group, but not finalized
    newGroup: ->
      gr = new ns.FileGroup
      gr.add(file) for file in @__files
      gr

    remove: (file) ->
      if (index = @__files.indexOf(file)) isnt -1
        @__files.splice(index, 1)
        # TODO unsubsribe progress
        @onFileRemoved.fire file

    save: ->
      unless @__finalized
        @__finalize()
        @__uploadDf.done =>
          @__createGroup()
            .done (groupInfo) =>
              @__uuid = groupInfo.group_id
              @__buildInfo (info) =>
                if @settings.imagesOnly && !info.isImage
                  @__infoDf.reject('image', info)
                else
                  @__infoDf.resolve(info)
            .fail =>
              @__infoDf.reject('info')

    cancel: =>
      @__finalize()
      file.cancel() for file in @__files

    # returns object that act like single file
    asSingle: ->
      pr = @__singleFileDf.promise()
      pr.cancel = @cancel
      pr

    isFinalized: -> @__finalized

    __initAsSingle: ->
      @__singleFileDf = $.Deferred()
      @__progressState = 'uploading'
      @__uploadDf.done =>
        @__progressState = 'uploaded'
        @__singleFileDf.notify @__progressInfo()
      @__infoDf.done (info) =>
        @__progressState = 'ready'
        @__singleFileDf.notify @__progressInfo()
        @__singleFileDf.resolve info
      fail = (err) =>
        @__buildInfo (info) =>
          @__singleFileDf.reject err, info
      @__infoDf.fail fail
      @__uploadDf.fail fail

    __progressInfo: ->
      progress = 0
      for file in @__files
        progress += ($(file).data('progress') or 0) / @__files.length
      state: @__progressState
      uploadProgress: progress
      progress: if @__progressState == 'ready' then 1 else progress * 0.9

    __fileInfos: (cb) ->
      files = for file in @__files
        file.then null, (err, info) -> $.when(info)
      $.when(files...).done cb

    __buildInfo: (cb) ->
      info = 
        fileId: @__uuid
        name: @__files.length + ' files' #FIXME
        size: 0
        isImage: true
        isStored: true
      @__fileInfos (infos...) ->
        for _info in infos
          info.size += _info.size
          info.isImage = false if !_info.isImage
          info.isStored = false if !_info.isStored
        cb(info)

    __finalize: ->
      unless @__finalized
        @__finalized = true
        @add = @remove = ->
          throw new Error("group can't be changed after save")
        $.when(@__files...)
          .then(@__uploadDf.resolve, @__uploadDf.reject)
        # if one file fails all fails
        @__uploadDf.fail @cancel

    __createGroup: ->
      # tmp
      return $.when({group_id: '123~4'})

      # df = $.Deferred()
      # @__fileInfos (infos...) ->
      #   data =
      #     pub_key: @settings.publicKey
      #   for info, i in infos
      #     data["file_id[#{i}]"] = info.fileId
      #   $.ajax("#{@settings.urlBase}/group/create/", {data, dataType: 'jsonp'})
      #     .then(df.resolve, df.reject)
      # return df.promise()


