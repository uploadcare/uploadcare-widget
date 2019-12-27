import { fileDragAndDrop } from '../utils/abilities'
import { build } from '../settings'
import { filesFrom, fileFrom } from '../files'
import { isWindowDefined } from '../utils/is-window-defined'
import ready from '../utils/ready'

const support = fileDragAndDrop

const uploadDrop = function(el, callback, settings) {
  settings = build(settings)

  return receiveDrop(el, function(data) {
    const type = 'object'
    return callback(
      settings.multiple
        ? filesFrom(type, data, settings)
        : fileFrom(type, data[0], settings)
    )
  })
}

const receiveDrop = !support
  ? function() {}
  : function(el, callback) {
      watchDragging(el)

      el.addEventListener('dragover', function(e) {
        e.preventDefault() // Prevent opening files.
        // This is way to change cursor.
        e.originalEvent.dataTransfer.dropEffect = 'copy'
      })

      el.addEventListener('drop', function(e) {
        e.preventDefault() // Prevent opening files.
        const dt = e.originalEvent.dataTransfer
        if (!dt) {
          return
        }
        if (dt.files.length) {
          return callback(dt.files)
        } else {
          const uris = dt
            .getData('text/uri-list')
            .split()
            .map(uri => uri.trim())
            .filter(uri => uri && uri[0] !== '#')

          if (uris) {
            return callback(uris)
          }
        }
      })
    }

const watchDragging = !support
  ? function() {}
  : function(el, receiver) {
      let lastActive = false
      let counter = 0
      const changeState = function(active) {
        if (lastActive !== active) {
          lastActive = active
          el.classList.toggle('uploadcare--dragging', active)
        }
      }

      const element = receiver || el

      element.addEventListener('dragenter', function() {
        counter += 1
        changeState(true)
      })

      element.addEventListener('dragleave', function() {
        counter -= 1
        if (counter === 0) {
          changeState(false)
        }
      })

      const finishHandler = function() {
        counter = 0
        changeState(false)
      }

      element.addEventListener('drop', finishHandler)
      element.addEventListener('mouseenter', finishHandler)
    }

isWindowDefined() && ready(() => watchDragging(document.body, document))

export { support, uploadDrop, watchDragging, receiveDrop }
