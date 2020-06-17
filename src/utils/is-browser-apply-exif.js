import $ from 'jquery'

// 2x1 pixel image 90CW rotated with orientation header
var testImageSrc = 'data:image/jpg;base64,' +
  '/9j/4AAQSkZJRgABAQEASABIAAD/4QA6RXhpZgAATU0AKgAAAAgAAwESAAMAAAABAAYAAAEo' +
  'AAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAD/2wBDAP//////////////////////////////' +
  '////////////////////////////////////////////////////////wAALCAABAAIBASIA' +
  '/8QAJgABAAAAAAAAAAAAAAAAAAAAAxABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAAPwBH/9k=';

var isApplied
var isBrowserApplyExif = () => {
  var df = $.Deferred()

  if (isApplied !== undefined) {
    df.resolve(isApplied)
  } else {
    var image = new window.Image()
    
    image.src = testImageSrc
    image.onload = () => {
      isApplied = image.naturalWidth < image.naturalHeight
      image.src = '//:0'
      df.resolve(isApplied)
    }
  }

  return df.promise()
}

export default isBrowserApplyExif
