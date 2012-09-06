# = require uploadcare/utils/abilities

uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.utils', (ns) ->
    # Generate UUID for upload file ID.
    # Taken from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    ns.uuid = ->
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace /[xy]/g, (c) ->
        r = Math.random() * 16|0
        v = if c == 'x' then r else r&0x3|0x8
        v.toString(16)

