import uploadcare from '../namespace'
import { canvas } from '../utils/abilities'

const {
  jQuery: $,
  templates: { tpl }
} = uploadcare

uploadcare.namespace('ui.progress', function (ns) {
  ns.Circle = class Circle {
    constructor (element) {
      this.update = this.update.bind(this)
      if (canvas) {
        this.renderer = new ns.CanvasRenderer(element)
      } else {
        this.renderer = new ns.TextRenderer(element)
      }
      this.observed = null
    }

    listen (file, selector) {
      var selectorFn
      this.reset()
      selectorFn = selector != null ? function (info) {
        return info[selector]
      } : function (x) {
        return x
      }
      this.observed = file
      if (this.observed.state() === 'resolved') {
        this.renderer.setValue(1, true)
      } else {
        this.observed.progress((progress) => {
          // if we are still listening to this one
          if (file === this.observed) {
            return this.renderer.setValue(selectorFn(progress))
          }
        }).always((uploadedFile) => {
          if (file === this.observed) {
            return this.renderer.setValue(1, false)
          }
        })
      }
      return this
    }

    reset (filled = false) {
      this.observed = null
      return this.renderer.setValue((filled ? 1 : 0), true)
    }

    update () {
      return this.renderer.update()
    }
  }
  ns.BaseRenderer = class BaseRenderer {
    constructor (el) {
      this.element = $(el)
      this.element.data('uploadcare-progress-renderer', this)
      this.element.addClass('uploadcare--progress')
    }

    update () {}
  }
  ns.TextRenderer = class TextRenderer extends ns.BaseRenderer {
    constructor () {
      super(...arguments)
      this.element.addClass('uploadcare--progress_type_text')
      this.element.html(tpl('progress__text'))
      this.text = this.element.find('.uploadcare--progress__text')
    }

    setValue (val) {
      val = Math.round(val * 100)
      return this.text.html(`${val} %`)
    }
  }

  ns.CanvasRenderer = class CanvasRenderer extends ns.BaseRenderer {
    constructor () {
      super(...arguments)
      this.canvasEl = $('<canvas>').addClass('uploadcare--progress__canvas').get(0)
      this.element.addClass('uploadcare--progress_type_canvas')
      this.element.html(this.canvasEl)
      this.setValue(0, true)
    }

    update () {
      var arc, ctx, half, size
      half = Math.floor(Math.min(this.element.width(), this.element.height()))
      size = half * 2
      if (half) {
        if (this.canvasEl.width !== size || this.canvasEl.height !== size) {
          this.canvasEl.width = size
          this.canvasEl.height = size
        }
        ctx = this.canvasEl.getContext('2d')
        arc = function (radius, val) {
          var offset
          offset = -Math.PI / 2
          ctx.beginPath()
          ctx.moveTo(half, half)
          ctx.arc(half, half, radius, offset, offset + 2 * Math.PI * val, false)
          return ctx.fill()
        }
        // Clear
        ctx.clearRect(0, 0, size, size)
        // Background circle
        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = this.element.css('border-left-color')
        arc(half - 0.5, 1)
        // Progress circle
        ctx.fillStyle = this.element.css('color')
        arc(half, this.val)
        // Make a hole
        ctx.globalCompositeOperation = 'destination-out'
        return arc(half / 7, 1)
      }
    }

    __animateValue (target) {
      var speed, start, val
      val = this.val
      start = new Date()
      speed = target > val ? 2 : -2
      this.__animIntervalId = setInterval(() => {
        var current
        current = val + (new Date() - start) / 1000 * speed
        current = (speed > 0 ? Math.min : Math.max)(current, target)
        if (current === target) {
          this.__stopAnimation()
        }
        return this.__setValue(current)
      }, 15)

      return this.__animIntervalId
    }

    __stopAnimation () {
      if (this.__animIntervalId) {
        clearInterval(this.__animIntervalId)
      }
      this.__animIntervalId = null
      return this.__animIntervalId
    }

    __setValue (val) {
      this.val = val
      return this.update()
    }

    setValue (val, instant = false) {
      this.__stopAnimation()
      if (instant) {
        return this.__setValue(val)
      } else {
        return this.__animateValue(val)
      }
    }
  }
})
