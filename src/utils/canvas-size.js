import $ from 'jquery'
import testCanvas from './canvas-test'

let promiseCache
const maxCanvasSize = () => {
  if (!promiseCache) {
    const df = $.Deferred()

    setTimeout(() => {
      df.resolve(testCanvas())
    })
  
    promiseCache = df.promise()
  }
  
  return promiseCache
}

export default maxCanvasSize
