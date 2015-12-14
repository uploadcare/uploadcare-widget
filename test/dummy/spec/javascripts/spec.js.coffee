# This pulls in all your specs from the javascripts directory into Jasmine:
#
# = require application
# = require_self
# = require ./utils
# = require mock-objects/manager
# = require_tree ./
# = require_tree ./fixtures/data

window.$ = window.jQuery = uploadcare.jQuery

window.UPLOADCARE_PUBLIC_KEY = 'demopublickey'
window.UPLOADCARE_URL_BASE = 'https://upload.staging0.uploadcare.com'
window.UPLOADCARE_PUSHER_KEY = 'c0d50edd02144b749006'
window.UPLOADCARE_SOCIAL_BASE = 'https://social.staging0.uploadcare.com/'
window.UPLOADCARE_CDN_BASE = 'http://staging0.ucarecdn.com/'
window.UPLOADCARE_SCRIPT_BASE = '/assets/uploadcare/'

jasmine.ns = (path, cb) ->
  node = jasmine
  for part in path.split '.' when part
    node = node[part] or= {}
  cb node

afterEach ->
  jasmine.mocks.clear()
