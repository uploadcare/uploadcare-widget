import $ from 'jquery'
import uploadcare from './namespace.coffee'
import { version } from '../../../../package.json'
# app/assets/javascripts/uploadcare/namespace.coffee

uploadcare.version = version

uploadcare.jQuery = $

{expose} = uploadcare

expose('version')
expose('jQuery')

expose 'plugin', (fn) ->
  fn(uploadcare)
