import locale from '../locale'
import { tpl } from '../templates'
import { Circle } from '../ui/progress'
import { parseHTML, callbacks } from '../utils'

class Template {
  constructor(settings, element) {
    this.settings = settings
    this.element = element
    this.content = parseHTML(tpl('widget'))
    this.element.insertAdjacentElement('afterend', this.content)
    const progressContainer = this.content
      .querySelector('.uploadcare--widget__progress')
    this.circle = new Circle(progressContainer)
    this.statusText = this.content.querySelector('.uploadcare--widget__text')
    this.content.classList.toggle(
      'uploadcare--widget_option_clearable',
      this.settings.clearable
    )
  }

  addButton(name, caption = '') {
    const button = parseHTML(tpl('widget-button', { name, caption }))
    this.content.appendChild(button)

    return button
  }

  setStatus(status) {
    var prefix
    prefix = 'uploadcare--widget_status_'
    this.content.classList.remove(prefix + this.content.getAttribute('data-status'))
    this.content.setAttribute('data-status', status)
    this.content.classList.add(prefix + status)
  }

  reset() {
    this.circle.reset()
    this.setStatus('ready')
    this.content.setAttribute('aria-busy', false)
    this.__file = undefined

    return this.__file
  }

  loaded() {
    this.setStatus('loaded')
    this.content.setAttribute('aria-busy', false)
    return this.circle.reset(true)
  }

  listen(file) {
    this.__file = file

    const progressCallback = callbacks()

    this.circle.listen(progressCallback, file, 'value')
    this.setStatus('started')
    this.content.setAttribute('aria-busy', true)

    return file.progress(info => {
      if (file === this.__file) {
        progressCallback.fire(info)

        switch (info.state) {
          case 'uploading':
            this.statusText.textContent = locale.t('uploading')
            break
          case 'uploaded':
            this.statusText.textContent = locale.t('loadingInfo')
            break
        }
      }
    })
  }

  error(type) {
    this.statusText.textContent = locale.t(`errors.${type || 'default'}`)
    this.content.setAttribute('aria-busy', false)
    this.setStatus('error')
  }

  setFileInfo(info) {
    this.statusText.innerHTML = tpl('widget-file-name', info)

    const fileName = this.statusText.querySelector('.uploadcare--widget__file-name')
    fileName && fileName.classList.toggle('needsclick', this.settings.systemDialog)
  }
}

export { Template }
