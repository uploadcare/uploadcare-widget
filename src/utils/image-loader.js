import $ from 'jquery'

// utils
const trackLoading = function(image, src) {
  let promiseResolve
  let promiseReject
  const promise = new Promise((resolve, reject) => {
    resolve = promiseResolve
    reject = promiseReject
  })
  if (src) {
    image.src = src
  }
  if (image.complete) {
    promiseResolve(image)
  } else {
    $(image).one('load', () => {
      return promiseResolve(image)
    })
    $(image).one('error', () => {
      return promiseReject(image)
    })
  }

  return promise
}

const imageLoader = function(image) {
  // if argument is an array, treat as
  // load(['1.jpg', '2.jpg'])
  if (Array.isArray(image)) {
    return $.when.apply(null, image.map(imageLoader))
  }
  if (image.src) {
    return trackLoading(image)
  } else {
    return trackLoading(new window.Image(), image)
  }
}

const videoLoader = function(src) {
  let promiseResolve
  let promiseReject
  const promise = new Promise((resolve, reject) => {
    resolve = promiseResolve
    reject = promiseReject
  })
  const video = document.createElement('video')

  video.addEventListener('loadeddata', promiseResolve)
  video.addEventListener('error', promiseReject)

  video.setAttribute('src', src)

  video.load()

  return promise
}

export { imageLoader, videoLoader }
