# = require uploadcare/api/uploader
# = require uploadcare/api/url-uploader
# = require ./template
# = require ./adapters

uploadcare.whenReady ->
  {
    namespace,
    initialize,
    jQuery,
  } = uploadcare
  
  namespace 'uploadcare.widget', (ns) ->
    class ns.Widget
      constructor: (@element) ->
        @settings = jQuery.extend({}, uploadcare.defaults, @element.data())
        @uploader = new uploadcare.api.Uploader(@settings)
        @urlUploader = new uploadcare.api.URLUploader(@settings)
        @template = new ns.Template(@element)
        @__setupAdapters()

        jQuery([@uploader, @urlUploader])
          .on('uploadcare.api.uploader.start', => @template.started())
          .on('uploadcare.api.uploader.error', => @template.error())
          .on('uploadcare.api.uploader.load', @__loaded)
          .on('uploadcare.api.uploader.progress', (e) =>
            @template.progress(e.target.loaded / e.target.fileSize)
          )

        jQuery(@template).on(
          'uploadcare.widget.template.cancel uploadcare.widget.template.remove',
          @__cancel
        )

        jQuery([@uploader, @urlUploader])
          .on('uploadcare.api.uploader.start', => @available = false)
          .on('uploadcare.api.uploader.cancel', => @available = true)

        @template.ready()
        @available = true

      __loaded: (e) =>
        @template.loaded()
        @template.setFileInfo(e.target.fileName, e.target.fileSize)
        @element.val(e.target.fileId)


      __cancel: =>
        @template.ready()
        @uploader.cancel()
        @urlUploader.cancel()
        @element.val(@uploader.fileId)
        jQuery(this).trigger('uploadcare.widget.cancel')

      __setupAdapters: ->
        @adapters = new Object
        for key in @settings.adapters.split(' ')
          if ns.adapters.registeredAdapters.hasOwnProperty(key)
            @adapters[key] = new ns.adapters.registeredAdapters[key](this)

    initialize class: ns.Widget, elements: '@uploadcare-uploader'
