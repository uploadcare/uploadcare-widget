import $ from 'jquery'
import { fileDragAndDrop } from '../utils/abilities'
import { build } from '../settings'
import { isWindowDefined } from '../utils/is-window-defined'
import { uploadFile } from '@uploadcare/upload-client'
import { filesFrom } from '../files'

const support = fileDragAndDrop

const uploadDrop = function(el, callback, settings) {
  settings = build(settings)

  return receiveDrop(el, function(type, data) {
    return callback(
      settings.multiple
        ? filesFrom(type, data, settings)
        : uploadFile(data[0], settings)
    )
  })
}

const receiveDrop = !support
  ? function() {}
  : function(el, callback) {
      watchDragging(el)

      $(el).on({
        dragover: function(e) {
          e.preventDefault() // Prevent opening files.
          // This is way to change cursor.
          e.originalEvent.dataTransfer.dropEffect = 'copy'
        },
        drop: function(e) {
          var dt, i, len, ref, uri, uris
          e.preventDefault() // Prevent opening files.
          dt = e.originalEvent.dataTransfer
          if (!dt) {
            return
          }
          if (dt.files.length) {
            // eslint-disable-next-line standard/no-callback-literal
            return callback('object', dt.files)
          } else {
            uris = []
            ref = dt.getData('text/uri-list').split()
            for (i = 0, len = ref.length; i < len; i++) {
              uri = ref[i]
              uri = $.trim(uri)
              if (uri && uri[0] !== '#') {
                uris.push(uri)
              }
            }
            if (uris) {
              // eslint-disable-next-line standard/no-callback-literal
              return callback('url', uris)
            }
          }
        }
      })
    }

const watchDragging = !support
  ? function() {}
  : function(el, receiver) {
      var changeState, counter, lastActive
      lastActive = false
      counter = 0
      changeState = function(active) {
        if (lastActive !== active) {
          lastActive = active
          return $(el).toggleClass('uploadcare--dragging', active)
        }
      }

      return $(receiver || el).on({
        dragenter: function() {
          counter += 1
          return changeState(true)
        },
        dragleave: function() {
          counter -= 1
          if (counter === 0) {
            return changeState(false)
          }
        },
        'drop mouseenter': function() {
          counter = 0
          return changeState(false)
        }
      })
    }

isWindowDefined() && watchDragging('body', document)

export { support, uploadDrop, watchDragging, receiveDrop }
