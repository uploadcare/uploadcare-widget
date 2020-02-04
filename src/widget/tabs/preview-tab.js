import { URL, Blob } from '../../utils/abilities'
import { imageLoader, videoLoader } from '../../utils/image-loader.ts'
import {
  defer,
  gcd as calcGCD,
  once,
  fitSize,
  readableFileSize,
  parseHTML,
  canvasToBlob
} from '../../utils'
import { drawFileToCanvas } from '../../utils/image-processor'
import locale from '../../locale'
import { tpl } from '../../templates'
// import { CropWidget } from '../../ui/crop-widget'
import { BasePreviewTab } from './base-preview-tab'
import { html } from '../../utils/html'

class PreviewTab extends BasePreviewTab {
  constructor(container, tabButton, dialogApi, settings, name) {
    super(...arguments)

    // error
    // unknown
    // image
    // video
    // regular
    this.container = container
    this.tabButton = tabButton
    this.dialogApi = dialogApi
    this.settings = settings
    this.name = name

    this.dialogApi.fileColl.get().forEach(file => {
      this.__setFile(file)
    })

    this.dialogApi.fileColl.onAdd.add(this.__setFile.bind(this))
    this.widget = null
    this.__state = null
  }

  __setFile(file) {
    this.file = file

    const ifCur = fn => {
      return (...args) => {
        if (file === this.file) {
          return fn.apply(null, args)
        }
      }
    }

    const tryToLoadImagePreview = once(this.__tryToLoadImagePreview.bind(this))
    const tryToLoadVideoPreview = once(this.__tryToLoadVideoPreview.bind(this))
    this.__setState('unknown', {})

    // this.file.progress(
    //   ifCur(info => {
    //     info = info.incompleteFileInfo
    //     const label = (info.name || '') + readableFileSize(info.size, '', ', ')
    //     this.container.querySelector(
    //       '.uploadcare--preview__file-name'
    //     ).textContent = label
    //     const source = info.sourceInfo
    //     const blob = Blob
    //     if (source.file && blob && source.file instanceof blob) {
    //       return tryToLoadImagePreview(file, source.file).catch(() => {
    //         return tryToLoadVideoPreview(file, source.file)
    //       })
    //     }
    //   })
    // )
    this.file.done(
      ifCur(info => {
        var imgInfo, src
        if (this.__state === 'video') {
          return
        }
        if (info.isImage) {
          // avoid subsequent image states
          if (this.__state !== 'image') {
            src = info.originalUrl
            // 1162x684 is 1.5 size of container
            src +=
              '-/preview/1162x693/-/setfill/ffffff/-/format/jpeg/-/progressive/yes/'
            if (this.settings.previewUrlCallback) {
              src = this.settings.previewUrlCallback(src, info)
            }
            imgInfo = info.imageInfo
            this.__setState('image', {
              src,
              name: info.name,
              info
            })
            return this.initImage(
              [imgInfo.width, imgInfo.height],
              info.cdnUrlModifiers
            )
          }
        } else {
          // , but update if other
          return this.__setState('regular', {
            file: info
          })
        }
      })
    )
    return this.file.fail(
      ifCur((error, info) => {
        return this.__setState('error', {
          error,
          file: info
        })
      })
    )
  }

  __tryToLoadImagePreview(file, blob) {
    let res = () => {}
    let rej = () => {}
    const promise = new Promise((resolve, reject) => {
      res = resolve
      rej = reject
    })
    if (
      file.state() !== 'pending' ||
      !blob.size ||
      blob.size >= this.settings.multipartMinSize
    ) {
      return new Promise(() => {
        rej()
      })
    }

    drawFileToCanvas(
      blob,
      1550,
      924,
      '#ffffff',
      this.settings.imagePreviewMaxSize
    )
      .then((canvas, size) => {
        return canvasToBlob(canvas, 'image/jpeg', 0.95, blob => {
          res()
          canvas.width = canvas.height = 1
          if (
            file.state() !== 'pending' ||
            this.dialogApi.state() !== 'pending' ||
            this.file !== file
          ) {
            return
          }
          const src = URL.createObjectURL(blob)
          this.dialogApi.always(function() {
            return URL.revokeObjectURL(src)
          })
          if (this.__state !== 'image') {
            this.__setState('image', {
              src,
              name: ''
            })
            return this.initImage(size)
          }
        })
      })
      .catch(rej)

    return promise
  }

  __tryToLoadVideoPreview(file, blob) {
    let res = () => {}
    let rej = () => {}
    const promise = new Promise((resolve, reject) => {
      res = resolve
      rej = reject
    })

    if (!URL || !blob.size) {
      return new Promise(() => {
        rej()
      })
    }
    const src = URL.createObjectURL(blob)
    const op = videoLoader(src)
    op.catch(() => {
      URL.revokeObjectURL(src)
      return rej()
    }).then(() => {
      res()
      this.dialogApi.always(function() {
        return URL.revokeObjectURL(src)
      })
      this.__setState('video')
      const videoTag = this.container.querySelector(
        '.uploadcare--preview__video'
      )
      // hack to enable seeking due to bug in MediaRecorder API
      // https://bugs.chromium.org/p/chromium/issues/detail?id=569840
      const loaded = videoTag.addEventListener('loadeddata', function() {
        const el = videoTag.get(0)
        el.currentTime = 360000 // 100 hours
        return videoTag.removeEventListener('loadeddata', loaded)
      })
      const ended = videoTag.addEventListener('ended', function() {
        const el = videoTag.get(0)
        el.currentTime = 0
        return videoTag.removeEventListener('ended', ended)
      })
      // end of hack
      videoTag.setAttribute('src', src)
      // hack to load first-frame poster on ios safari
      return videoTag.get(0).load()
    })

    return promise
  }

  __setState(state, data) {
    this.__state = state
    data = data || {}
    data.crop = this.settings.crop

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }

    this.container.appendChild(parseHTML(tpl(`tab-preview-${state}`, data)))

    Array.from(this.container.classList)
      .filter(
        className => className.indexOf('uploadcare--preview_status_') !== -1
      )
      .forEach(classToRemove => {
        this.container.classList.remove(classToRemove)
      })

    if (state === 'unknown' && this.settings.crop) {
      this.container.querySelector('.uploadcare--preview__done').style.display =
        'none'
    }

    if (state === 'error') {
      this.container.classList.add(
        'uploadcare--preview_status_error-' + data.error
      )
    }

    const done = this.container.querySelector('.uploadcare--preview__done')
    done && done.focus()
  }

  initImage(imgSize, cdnModifiers) {
    const img = this.container.querySelector('.uploadcare--preview__image')
    const done = this.container.querySelector('.uploadcare--preview__done')
    const imgLoader = imageLoader(img)
      .then(() => {
        return this.container.classList.add('uploadcare--preview_status_loaded')
      })
      .catch(() => {
        this.file = null
        return this.__setState('error', {
          error: 'loadImage'
        })
      })

    const startCrop = () => {
      const $cropSizesItem = this.container.querySelector(
        '.uploadcare--crop-sizes__item'
      )
      $cropSizesItem.removeAttribute('aria-disabled')
      $cropSizesItem.setAttribute('tabindex', 0)

      done.removeAttribute('disabled')
      done.removeAttribute('aria-disabled')
      // crop logic
      // this.widget = new CropWidget(img, imgSize, this.settings.crop[0])
      // if (cdnModifiers) {
      //   this.widget.setSelectionFromModifiers(cdnModifiers)
      // }
      // return done.addEventListener('click', () => {
      //   const newFile = this.widget.applySelectionToFile(this.file)
      //   this.dialogApi.fileColl.replace(this.file, newFile)
      //
      //   return true
      // })
    }

    if (this.settings.crop) {
      this.container.querySelector(
        '.uploadcare--preview__title'
      ).textContent = locale.t('dialog.tabs.preview.crop.title')
      this.container
        .querySelector('.uploadcare--preview__content')
        .classList.add('uploadcare--preview__content_crop')
      done.disabled = true
      done.setAttribute('aria-disabled', true)
      done.textContent = locale.t('dialog.tabs.preview.crop.done')
      this.populateCropSizes()
      const $cropSizes = this.container.querySelector(
        '.uploadcare--crop-sizes__item'
      )
      $cropSizes.setAttribute('aria-disabled', 'true')
      $cropSizes.setAttribute('tabindex', -1)
      return imgLoader
        .then(function() {
          // Often IE 11 doesn't do reflow after image.onLoad
          // and actual image remains 28x30 (broken image placeholder).
          // Looks like defer always fixes it.
          return defer(startCrop)
        })
    }
  }

  populateCropSizes() {
    const control = this.container.querySelector('.uploadcare--crop-sizes')
    const template = control.children
    const currentClass = 'uploadcare--crop-sizes__item_current'

    this.settings.crop.forEach((crop, i) => {
      let caption
      const preferred = crop.preferedSize
      if (preferred) {
        const gcd = calcGCD(preferred[0], preferred[1])
        caption = `${preferred[0] / gcd}:${preferred[1] / gcd}`
      } else {
        caption = locale.t('dialog.tabs.preview.crop.free')
      }
      const item = template[0].cloneNode(true)
      control.append(item)

      item.dataset.caption = caption
      item.addEventListener('click', e => {
        if (e.currentTarget.getAttribute('aria-disabled') === 'true') {
          return
        }
        if (
          !e.currentTarget.classList.contains(currentClass) &&
          this.settings.crop.length > 1 &&
          this.widget
        ) {
          this.widget.setCrop(crop)
          control.querySelector('>*').classList.remove(currentClass)
          item.classList.add(currentClass)
        }
      })
      if (preferred) {
        const size = fitSize(preferred, [30, 30], true)
        const items = item.children

        items.style.width = Math.max(20, size[0])
        items.style.height = Math.max(12, size[1])

        return item
      } else {
        const icon = parseHTML(html`
          "<svg
            class="uploadcare--icon"
            width="32"
            height="32"
            role="presentation"
          >
            <use xlink:href="#uploadcare--icon-crop-free" /></svg
          >"
        `)

        item.append(icon)

        return item.classList.add('uploadcare--crop-sizes__icon_free')
      }
    })

    template[0].parentNode.removeChild(template[0])

    return control.children[0].classList.add(currentClass)
  }

  displayed() {
    this.container.querySelector('.uploadcare--preview__done').focus()
  }
}

export { PreviewTab }
