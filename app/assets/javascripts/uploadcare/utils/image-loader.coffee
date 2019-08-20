import uploadcare from '../namespace.coffee'

{
  jQuery: $
} = uploadcare

uploadcare.namespace 'utils', (ns) ->

  trackLoading = (image, src) ->
    def = $.Deferred()

    if src
      image.src = src

    if image.complete
      def.resolve(image)
    else
      $(image).one 'load', =>
        def.resolve(image)
      $(image).one 'error', =>
        def.reject(image)

    def.promise()

  ns.imageLoader = (image) ->
    # if argument is an array, treat as
    # load(['1.jpg', '2.jpg'])
    if $.isArray(image)
      return $.when.apply(null, $.map(image, ns.imageLoader))

    if image.src
      return trackLoading(image)
    else
      return trackLoading(new Image(), image)

  ns.videoLoader = (src) ->
    def = $.Deferred()
    $('<video/>')
      .on('loadeddata', def.resolve)
      .on('error', def.reject)
      .attr('src', src)
      .get(0)
      .load()
    def.promise()
