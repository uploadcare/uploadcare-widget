# This pulls in all your specs from the javascripts directory into Jasmine:
#
# = require_self
# = require ./utils
# = require application
# = require mock-objects/manager
# = require_tree ./
# = require_tree ./fixtures/data

jasmine.ns = (path, cb) ->
  node = jasmine
  for part in path.split '.' when part
    node = node[part] or= {}
  cb node

afterEach ->
  jasmine.mocks.clear()
