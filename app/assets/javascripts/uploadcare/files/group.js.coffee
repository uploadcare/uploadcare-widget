{
  namespace,
  jQuery: $,
  utils,
  locale: {t}
} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.FileGroup

    constructor: (files, settings) ->
      @settings = utils.buildSettings settings
      @__files = (file for file in files when file)

      @__createGroupDf = $.Deferred()
      @__initAsSingle()
      @__save()

    # check if two groups contains same files in same order
    equal: (group) ->
      if group
        filesA = @__files
        filesB = group.files()
        return false if filesA.length isnt filesB.length
        for file, i in filesA
          return false if file isnt filesB[i]
        return true 
      else
        return false

    # returns copy of @__files
    files: ->
      @__files.slice(0)

    add: (file) ->
      if file
        new ns.FileGroup @files().push(file), @settings
      else
        this

    remove: (file) ->
      files = @files()
      if utils.remove(files, file)
        return new ns.FileGroup files, @settings
      else
        this

    __save: ->
      unless @__saved
        @__saved = true
        $.when(@__files...).done =>
          @__createGroup()
            .done (groupInfo) =>
              @__uuid = groupInfo.id
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
      incompleteFileInfo: {}

    __fileInfos: (cb) ->
      files = for file in @__files
        file.then null, (err, info) -> $.when(info)
      $.when(files...).done cb

    __buildInfo: (cb) ->
      info = 
        uuid: @__uuid
        cdnUrl: "#{@settings.cdnBase}/#{@__uuid}/"
        name: t('file', @__files.length)
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
      df = $.Deferred()
      @__fileInfos (infos...) =>
        data =
          pub_key: @settings.publicKey
        for info, i in infos
          data["files[#{i}]"] = info.cdnUrl
        $.ajax("#{@settings.urlBase}/group/", {data, dataType: 'jsonp'})
          .then(df.resolve, df.reject)
      return df.promise()


namespace 'uploadcare.utils', (utils) ->

  utils.isFileGroup = (obj) ->
    return obj and obj.add and obj.equal and obj.asSingle

  # Converts any of:
  #   group ID
  #   group CDN-URL
  #   array of what utils.anyToFile() can take
  #   FileGroup object
  # to FileGroup object
  utils.anyToFileGroup = (value, settings) ->
    if value
      if $.isArray(value)
        files = utils.anyToFile(item, settings) for item in value
        uploadcare.fileGroupFrom('files', files, settings)
      else
        if utils.isFileGroup(value)
          value
        else
          uploadcare.fileGroupFrom('uploaded', value, settings)
    else
      null
