import { canvas } from '../utils/abilities'
import { tpl } from '../templates'

// ui.progress
class Circle {
  constructor(element) {
    if (canvas) {
      this.renderer = new CanvasRenderer(element)
    } else {
      this.renderer = new TextRenderer(element)
    }
    this.observed = null
  }

  listen(file, selector) {
    var selectorFn
    this.reset()
    selectorFn =
      selector != null
        ? function(info) {
            return info[selector]
          }
        : function(x) {
            return x
          }
    this.observed = file
    if (this.observed.state() === 'resolved') {
      this.renderer.setValue(1, true)
    } else {
      this.observed
        .progress(progress => {
          // if we are still listening to this one
          if (file === this.observed) {
            return this.renderer.setValue(selectorFn(progress))
          }
        })
        .always(uploadedFile => {
          if (file === this.observed) {
            return this.renderer.setValue(1, false)
          }
        })
    }
    return this
  }

  reset(filled = false) {
    this.observed = null
    return this.renderer.setValue(filled ? 1 : 0, true)
  }

  update() {
    return this.renderer.update()
  }
}

class BaseRenderer {
  constructor(el) {
    this.element = document.querySelector(el)
    this.element.dataset['uploadcare-progress-renderer'] = this
    this.element.classList.add('uploadcare--progress')
  }

  update() {}
}

class TextRenderer extends BaseRenderer {
  constructor() {
    super(...arguments)
    this.element.classList.add('uploadcare--progress_type_text')
    this.element.innerHTML = tpl('progress__text')
    this.text = this.element.querySelector('.uploadcare--progress__text')
  }

  setValue(val) {
    val = Math.round(val * 100)
    return (this.text.innerHTML = `${val} %`)
  }
}

class CanvasRenderer extends BaseRenderer {
  constructor() {
    super(...arguments)
    this.canvasEl = document
      .createElement('canvas')
      .classList.add('uploadcare--progress__canvas')
    this.element.classList.add('uploadcare--progress_type_canvas')
    this.element.innerHTML = this.canvasEl
    this.setValue(0, true)
  }

  update() {
    var arc, ctx, half, size
    const getWidth = element =>
      parseFloat(window.getComputedStyle(element, null).width.replace('px', ''))
    const getHeight = element => element.offsetHeight

    half = Math.floor(Math.min(getWidth(this.element), getHeight(this.element)))

    size = half * 2
    if (half) {
      if (this.canvasEl.width !== size || this.canvasEl.height !== size) {
        this.canvasEl.width = size
        this.canvasEl.height = size
      }
      ctx = this.canvasEl.getContext('2d')
      arc = function(radius, val) {
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

  __animateValue(target) {
    var speed, start, val
    val = this.val
    start = new Date()
    speed = target > val ? 2 : -2
    this.__animIntervalId = setInterval(() => {
      var current
      current = val + ((new Date() - start) / 1000) * speed
      current = (speed > 0 ? Math.min : Math.max)(current, target)
      if (current === target) {
        this.__stopAnimation()
      }
      return this.__setValue(current)
    }, 15)

    return this.__animIntervalId
  }

  __stopAnimation() {
    if (this.__animIntervalId) {
      clearInterval(this.__animIntervalId)
    }
    this.__animIntervalId = null
    return this.__animIntervalId
  }

  __setValue(val) {
    this.val = val
    this.element.setAttribute('aria-valuenow', (val * 100).toFixed(0));
    return this.update()
  }

  setValue(val, instant = false) {
    this.__stopAnimation()
    if (instant) {
      return this.__setValue(val)
    } else {
      return this.__animateValue(val)
    }
  }
}

export { Circle, BaseRenderer, TextRenderer, CanvasRenderer }
