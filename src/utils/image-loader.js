import $ from 'jquery'

// utils
const trackLoading = function(image, src) {
  var def
  def = $.Deferred()
  if (src) {
    image.src = src
  }
  if (image.complete) {
    def.resolve(image)
  } else {
    $(image).one('load', () => {
      return def.resolve(image)
    })
    $(image).one('error', () => {
      return def.reject(image)
    })
  }

  return def.promise()
}

const imageLoader = function(image) {
  // if argument is an array, treat as
  // load(['1.jpg', '2.jpg'])
  if ($.isArray(image)) {
    return $.when.apply(null, $.map(image, imageLoader))
  }
  if (image.src) {
    return trackLoading(image)
  } else {
    return trackLoading(new window.Image(), image)
  }
}

const videoLoader = function(src) {
  var def = $.Deferred()

  $('<video></video>')
    .on('loadeddata', def.resolve)
    .on('error', def.reject)
    .attr('src', src)
    .get(0)
    .load()

  return def.promise()
}

export { imageLoader, videoLoader }
