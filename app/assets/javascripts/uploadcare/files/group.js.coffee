{
  namespace,
  jQuery: $,
  utils,
  locale: {t},
  settings: s
} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.FileGroup

    constructor: (files, settings) ->
      @settings = s.build settings
      @__fileColl = new utils.CollectionOfPromises(files)

      @__allFilesDf = $.when @__fileColl.get()...
      @__fileInfosDf = do =>
        files = for file in @__fileColl.get()
          file.then null, (err, info) -> $.when(info)
        $.when(files...)

      @__createGroupDf = $.Deferred()
      @__initApiDeferred()

    files: ->
      @__fileColl.get()

    __save: ->
      unless @__saved
        @__saved = true
        @__allFilesDf.done =>
          @__createGroup()
            .done (groupInfo) =>
              @__uuid = groupInfo.id
              @__buildInfo (info) =>
                if @settings.imagesOnly && !info.isImage
                  @__createGroupDf.reject('image', info)
                else
                  @__createGroupDf.resolve(info)
            .fail =>
              @__createGroupDf.reject('createGroup')

    # returns object similar to File object
    promise: ->
      @__save()
      @__apiDf.promise()

    __initApiDeferred: ->
      @__apiDf = $.Deferred()
      @__progressState = 'uploading'

      reject = (err) =>
        @__buildInfo (info) =>
          @__apiDf.reject err, info
      resolve = (info) =>
        @__apiDf.resolve info
      notify = =>
        @__apiDf.notify @__progressInfo()
        
      notify()
      @__fileColl.onAnyProgress.add notify

      @__allFilesDf
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
      progressInfos = @__fileColl.lastProgresses()
      for progressInfo in progressInfos
        progress += (progressInfo?.progress or 0) / progressInfos.length
      state: @__progressState
      uploadProgress: progress
      progress: if @__progressState == 'ready' then 1 else progress * 0.9
      incompleteFileInfo: {}

    __buildInfo: (cb) ->
      info = 
        uuid: @__uuid
        cdnUrl: "#{@settings.cdnBase}/#{@__uuid}/"
        name: t('file', @__fileColl.length())
        size: 0
        isImage: true
        isStored: true
      @__fileInfosDf.done (infos...) ->
        for _info in infos
          info.size += _info.size
          info.isImage = false if !_info.isImage
          info.isStored = false if !_info.isStored
        cb(info)

    __createGroup: ->
      df = $.Deferred()
      if @__fileColl.length()
        @__fileInfosDf.done (infos...) =>
          data =
            pub_key: @settings.publicKey
          for info, i in infos
            data["files[#{i}]"] = info.uuid
          $.ajax("#{@settings.urlBase}/group/", {data, dataType: 'jsonp'})
            .fail(df.reject)
            .done (data) ->
              if data.error
                df.reject()
              else
                df.resolve(data)
      else
        df.reject()
      return df.promise()

    api: ->
      unless @__api
        @__api = utils.bindAll this, [
          'promise'
          'files'
        ]
      @__api


  class ns.SavedFileGroup extends ns.FileGroup

    constructor: (@__data, settings) ->
      files = uploadcare.filesFrom('ready', @__data.files, settings)
      super(files, settings)

    __createGroup: ->
      utils.wrapToPromise(@__data)


namespace 'uploadcare', (ns) ->

  ns.FileGroup = (filesAndGroups = [], settings) ->
    files = []
    for item in filesAndGroups
      if utils.isFile(item)
        files.push item
      else if utils.isFileGroup(item)
        for file in item.files()
          files.push file
    return new uploadcare.files.FileGroup(files, settings).api()

  ns.loadFileGroup = (groupIdOrUrl, settings) ->
    settings = s.build settings
    df = $.Deferred()
    id = utils.groupIdRegex.exec(groupIdOrUrl)
    if id
      data =
        pub_key: settings.publicKey
        group_id: id[0]
      $.ajax("#{settings.urlBase}/group/info/", {data, dataType: 'jsonp'})
        .fail(df.reject)
        .done (data) ->
          if data.error
            df.reject()
          else
            df.resolve new uploadcare.files.SavedFileGroup(data, settings).api()
    else
      df.reject()
    df.promise()


namespace 'uploadcare.utils', (utils) ->

  utils.isFileGroup = (obj) ->
    return obj and obj.files and obj.promise

  # Converts any of:
  #   group ID
  #   group CDN-URL
  #   array of what utils.anyToFile() can take
  #   FileGroup object
  # to FileGroup object (returned through promise)
  utils.anyToFileGroup = (value, settings) ->
    if value
      if $.isArray(value)
        files = utils.anyToFile(item, settings) for item in value
        utils.wrapToPromise(uploadcare.FileGroup files, settings)
      else
        if utils.isFileGroup(value)
          utils.wrapToPromise(value)
        else
          uploadcare.loadFileGroup(value, settings)
    else
      utils.wrapToPromise(null)

  # check if two groups contains same files in same order
  utils.isFileGroupsEqual = (group1, group2) ->
    if group1 == group2
      true
    else
      if utils.isFileGroup(group1) and utils.isFileGroup(group2)
        files1 = group1.files()
        files2 = group2.files()
        if files1.length isnt files2.length
          false
        else
          mismatches = (1 for file, i in files1 when file isnt files2[i])
          if mismatches.length
            false
          else
            true
      else
        false
