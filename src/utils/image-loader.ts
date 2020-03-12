// utils
const trackLoading = (image: HTMLImageElement): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
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

const makeImage = function(image: HTMLImageElement | HTMLImageElement[]): Promise<HTMLImageElement | HTMLImageElement[]> {
  // if argument is an array, treat as
  // load(['1.jpg', '2.jpg'])
  if (Array.isArray(image)) {
    return Promise.all(image.map(img => trackLoading(img)))
  } else {
    return trackLoading(image)
  }
}

const imageLoader = function(image: string | HTMLImageElement | HTMLImageElement[]): Promise<HTMLImageElement | HTMLImageElement[]> {
  if (typeof image === 'string') {
    const img = new window.Image()

    img.src = image
    image = img
  }

  return makeImage(image)
}

const videoLoader = function(src: string): Promise<Event> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')

    video.addEventListener('loadeddata', resolve)
    video.addEventListener('error', reject)

    video.setAttribute('src', src)

    video.load()
  })
}

export { imageLoader, videoLoader }
