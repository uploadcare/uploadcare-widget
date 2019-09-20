import $ from 'jquery'
import uploadcare from './namespace'
import { version } from '../../../../package.json'

uploadcare.version = version
uploadcare.jQuery = $

const { expose } = uploadcare

expose('version')
expose('jQuery')
expose('plugin', function (fn) {
  return fn(uploadcare)
})
