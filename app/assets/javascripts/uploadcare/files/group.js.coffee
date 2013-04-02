{
  namespace,
  jQuery: $,
  utils
} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.FileGroup

    constructor: (@__files, settings) ->
      @settings = utils.buildSettings settings
      @__createGroupDf = $.Deferred()
      @__initAsSingle()
      @__save()

    # check if two groups contains same files in same order
    equal: (group) ->
      filesA = @__files
      filesB = group.files()
      return false if filesA.length isnt filesB.length
      for file, i in filesA
        return false if file isnt filesB[i]
      return true 

    # returns copy of @__files
    files: ->
      file for file in @__files 

    add: (file) ->
      return new ns.FileGroup @files().push(file), @settings

    remove: (file) ->
      files = @files()
      utils.remove(files, file)
      return new ns.FileGroup files, @settings

    __save: ->
      unless @__saved
        @__saved = true
        @__uploadDf.done =>
          @__createGroup()
            .done (groupInfo) =>
              @__uuid = groupInfo.group_id
              @__buildInfo (info) =>
                if @settings.imagesOnly && !info.isImage
                  @__createGroupDf.reject('image', info)
                else
                  @__createGroupDf.resolve(info)
            .fail =>
              @__createGroupDf.reject('info')

    # returns object that act like single file
    asSingle: ->
      # FIXME: add fake .cancel()?
      @__singleFileDf.promise()      

    __initAsSingle: ->
      @__singleFileDf = $.Deferred()
      @__progressState = 'uploading'
      @__progressInfos = []

      reject = (err) =>
        @__buildInfo (info) =>
          @__singleFileDf.reject err, info
      resolve = (info) =>
        @__singleFileDf.resolve info
      notify = =>
        @__singleFileDf.notify @__progressInfo()
        
      $.when(@__files...)
        .progress (prpgressInfos...) =>
          @__progressInfos = prpgressInfos
          notify()
        .done =>
          @__progressState = 'uploaded'
          notify()
        .fail reject

      @__createGroupDf
        .done (info) =>
          @__progressState = 'ready'
          notify()
          resolve(info)
        .fail reject

    __progressInfo: ->
      progress = 0
      for progressInfo in @__progressInfos
        progress += (progressInfo?.progress or 0) / @__progressInfos.length
      state: @__progressState
      uploadProgress: progress
      progress: if @__progressState == 'ready' then 1 else progress * 0.9
      # TODO: incompleteFileInfo?

    __fileInfos: (cb) ->
      files = for file in @__files
        file.then null, (err, info) -> $.when(info)
      $.when(files...).done cb

    __buildInfo: (cb) ->
      info = 
        uuid: @__uuid
        cdnUrl: "#{@settings.cdnBase}/#{@__uuid}/"
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
