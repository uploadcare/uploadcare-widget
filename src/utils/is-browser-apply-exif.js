import $ from 'jquery'

var testImage = 'data:image/jpeg;base64,' +
  '/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/7QA0UGhvdG9zaG9wIDMu' +
  'MAA4QklNBAQAAAAAABccAgUAC2JsdWVpbXAubmV0HAIAAAIABAD/2wCEAAEBAQEBAQEBAQEB' +
  'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB' +
  'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB' +
  'AQEBAQEBAQEBAf/AABEIAAIAAwMBEQACEQEDEQH/xABRAAEAAAAAAAAAAAAAAAAAAAAKEAEB' +
  'AQADAQEAAAAAAAAAAAAGBQQDCAkCBwEBAAAAAAAAAAAAAAAAAAAAABEBAAAAAAAAAAAAAAAA' +
  'AAAAAP/aAAwDAQACEQMRAD8AG8T9NfSMEVMhQvoP3fFiRZ+MTHDifa/95OFSZU5OzRzxkyej' +
  'v8ciEfhSceSXGjS8eSdLnZc2HDm4M3BxcXwH/9k='

var isApplied

var isBrowserApplyExif = () => {
  var df = $.Deferred()

  if (isApplied !== undefined) {
    df.resolve(isApplied)
  } else {
    var image = new window.Image()
    
    image.src = testImage
    image.onload = () => {
      isApplied = image.width === 2
      image.src = '//:0'
      df.resolve(isApplied)
    }
  }

  return df.promise()
}

export default isBrowserApplyExif