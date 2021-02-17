import $ from 'jquery'
import testCanvas from './canvas-test'
import { defer } from '../utils'

let promiseCache
const maxCanvasSize = () => {
  if (!promiseCache) {
    const df = $.Deferred()

    defer(() => {
      df.resolve(testCanvas())
    })

    promiseCache = df.promise()
  }

  return promiseCache
}

export default maxCanvasSize
