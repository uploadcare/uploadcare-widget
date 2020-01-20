import { Circle } from '../../ui/progress'
import { callbacks, matches } from '../../utils'

class BasePreviewTab {
  constructor(container, tabButton, dialogApi, settings, name) {
    this.container = container
    this.tabButton = tabButton
    this.dialogApi = dialogApi
    this.settings = settings
    this.name = name
    this.__initTabButtonCircle()
    this.container.classList.add('uploadcare--preview')
    const notDisabled = ':not(:disabled)'

    this.container.addEventListener(
      'click',
      (e) => {
        if (matches(e.target, '.uploadcare--preview__back' + notDisabled)) {
          return this.dialogApi.fileColl.clear()
        }
      }
    )

    this.container.addEventListener(
      'click',
      (e) => {
        if (matches(e.target, '.uploadcare--preview__done' + notDisabled)) {
          this.dialogApi.resolve()
        }
      }
    )
  }

  __initTabButtonCircle() {
    const circleEl = this.tabButton.querySelector('.uploadcare--panel__icon')

    const progressCallback = callbacks()
    const update = () => {
      var i, infos, len, progress, progressInfo
      infos = this.dialogApi.fileColl.lastProgresses()
      progress = 0
      for (i = 0, len = infos.length; i < len; i++) {
        progressInfo = infos[i]
        progress +=
          ((progressInfo != null ? progressInfo.progress : undefined) || 0) /
          infos.length
      }
      return progressCallback.fire(progress)
    }

    this.dialogApi.fileColl.onAnyProgress(update)
    this.dialogApi.fileColl.onAdd.add(update)
    this.dialogApi.fileColl.onRemove.add(update)

    update()

    const circle = new Circle(circleEl).listen(progressCallback)
    return this.dialogApi.progress((...args) => circle.update(...args))
  }
}

export { BasePreviewTab }
