import $ from 'jquery'

import { t } from '../locale'
import { tpl } from '../templates'
import { Circle } from '../ui/progress'

class Template {
  constructor (settings, element) {
    this.settings = settings
    this.element = element
    this.content = $(tpl('widget'))
    this.element.after(this.content)
    this.circle = new Circle(this.content.find('.uploadcare--widget__progress').removeClass('uploadcare--widget__progress'))
    this.content.find('.uploadcare--progress').addClass('uploadcare--widget__progress')
    this.statusText = this.content.find('.uploadcare--widget__text')
    this.content.toggleClass('uploadcare--widget_option_clearable', this.settings.clearable)
  }

  addButton (name, caption = '') {
    return $(tpl('widget-button', { name, caption })).appendTo(this.content)
  }

  setStatus (status) {
    var prefix
    prefix = 'uploadcare--widget_status_'
    this.content.removeClass(prefix + this.content.attr('data-status'))
    this.content.attr('data-status', status)
    this.content.addClass(prefix + status)
    return this.element.trigger(`${status}.uploadcare`)
  }

  reset () {
    this.circle.reset()
    this.setStatus('ready')
    this.__file = undefined

    return this.__file
  }

  loaded () {
    this.setStatus('loaded')
    return this.circle.reset(true)
  }

  listen (file) {
    this.__file = file

    this.circle.listen(file, 'uploadProgress')
    this.setStatus('started')

    return file.progress((info) => {
      if (file === this.__file) {
        switch (info.state) {
          case 'uploading':
            return this.statusText.text(t('uploading'))
          case 'uploaded':
            return this.statusText.text(t('loadingInfo'))
        }
      }
    })
  }

  error (type) {
    this.statusText.text(t(`errors.${type || 'default'}`))
    return this.setStatus('error')
  }

  setFileInfo (info) {
    return this.statusText.html(tpl('widget-file-name', info)).find('.uploadcare--widget__file-name').toggleClass('needsclick', this.settings.systemDialog)
  }
}

export { Template }
