import uploadcare from '../namespace'
import { fileDragAndDrop } from '../utils/abilities'

const {
  settings: s,
  jQuery: $
} = uploadcare

uploadcare.namespace('dragdrop', function (ns) {
  ns.support = fileDragAndDrop

  ns.uploadDrop = function (el, callback, settings) {
    settings = s.build(settings)
    return ns.receiveDrop(el, function (type, data) {
      return callback(settings.multiple ? uploadcare.filesFrom(type, data, settings) : uploadcare.fileFrom(type, data[0], settings))
    })
  }

  if (!ns.support) {
    ns.receiveDrop = function () {}
  } else {
    ns.receiveDrop = function (el, callback) {
      ns.watchDragging(el)

      $(el).on({
        dragover: function (e) {
          e.preventDefault() // Prevent opening files.
          // This is way to change cursor.
          e.originalEvent.dataTransfer.dropEffect = 'copy'
        },
        drop: function (e) {
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

    ns.watchDragging = function (el, receiver) {
      var changeState, counter, lastActive
      lastActive = false
      counter = 0
      changeState = function (active) {
        if (lastActive !== active) {
          lastActive = active
          return $(el).toggleClass('uploadcare--dragging', active)
        }
      }

      return $(receiver || el).on({
        dragenter: function () {
          counter += 1
          return changeState(true)
        },
        dragleave: function () {
          counter -= 1
          if (counter === 0) {
            return changeState(false)
          }
        },
        'drop mouseenter': function () {
          counter = 0
          return changeState(false)
        }
      })
    }

    ns.watchDragging('body', document)
  }
})
