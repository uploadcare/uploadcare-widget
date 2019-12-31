import $ from 'jquery'

import { Circle } from '../../ui/progress'

class BasePreviewTab {
  constructor(container, tabButton, dialogApi, settings, name) {
    var notDisabled
    this.container = container
    this.tabButton = tabButton
    this.dialogApi = dialogApi
    this.settings = settings
    this.name = name
    this.__initTabButtonCircle()
    this.container.addClass('uploadcare--preview')
    notDisabled = ':not(:disabled)'
    this.container.on(
      'click',
      '.uploadcare--preview__back' + notDisabled,
      () => {
        return this.dialogApi.fileColl.clear()
      }
    )
    this.container.on(
      'click',
      '.uploadcare--preview__done' + notDisabled,
      this.dialogApi.resolve
    )
  }

  __initTabButtonCircle() {
    const circleEl = this.tabButton.find('.uploadcare--panel__icon')

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

    const circle = new Circle(circleEl[0]).listen(progressCallback)
    return this.dialogApi.progress((...args) => circle.update(...args))
  }
}

export { BasePreviewTab }
