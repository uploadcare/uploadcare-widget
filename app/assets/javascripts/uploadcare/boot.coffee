import $ from 'jquery'
import uploadcare from './namespace'
import { version } from '../../../../package.json'

uploadcare.version = version

uploadcare.jQuery = $

{expose} = uploadcare

expose('version')
expose('jQuery')

expose 'plugin', (fn) ->
  fn(uploadcare)
