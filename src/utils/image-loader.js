// utils
const trackLoading = (image, src) =>
  new Promise((resolve, reject) => {
    if (src) {
      image.src = src
    }
    if (image.complete) {
      resolve(image)
    } else {
      image.addEventListener('load', () => {
        resolve(image)
      })
      image.addEventListener('error', () => {
        reject(image)
      })
    }
  })

const imageLoader = function(image) {
  // if argument is an array, treat as
  // load(['1.jpg', '2.jpg'])
  if (Array.isArray(image)) {
    return Promise.all(image.map(imageLoader))
  }
  if (image.src) {
    return trackLoading(image)
  } else {
    return trackLoading(new window.Image(), image)
  }
}

const videoLoader = function(src) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')

    video.addEventListener('loadeddata', resolve)
    video.addEventListener('error', reject)

    video.setAttribute('src', src)

    video.load()
  })
}

export { imageLoader, videoLoader }
