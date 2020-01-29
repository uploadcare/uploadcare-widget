import { URL, Blob } from '../../utils/abilities'
import { imageLoader, videoLoader } from '../../utils/image-loader'
import {
  // defer,
  gcd as calcGCD,
  once,
  fitSize,
  readableFileSize,
  canvasToBlob,
  parseHTML,
  each
} from '../../utils'
import { drawFileToCanvas } from '../../utils/image-processor'
import locale from '../../locale'
import { tpl } from '../../templates'
// import { CropWidget } from '../../ui/crop-widget'
import { BasePreviewTab } from './base-preview-tab'

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
    this.file.progress(
      ifCur(info => {
        info = info.incompleteFileInfo
        const label = (info.name || '') + readableFileSize(info.size, '', ', ')
        this.container.querySelector(
          '.uploadcare--preview__file-name'
        ).textContent = label
        const source = info.sourceInfo
        const blob = Blob
        if (source.file && blob && source.file instanceof blob) {
          return tryToLoadImagePreview(file, source.file).catch(() => {
            return tryToLoadVideoPreview(file, source.file)
          })
        }
      })
    )
    this.file.then(
      ifCur(info => {
        var imgInfo, src
        if (this.__state === 'video') {
          return
        }
        if (info.isImage) {
          // avoid subsequent image states
          if (this.__state !== 'image') {
            src = info.originalUrl
            // 1162x684 is 1.5 size of conteiner
            src +=
              '-/preview/1162x693/-/setfill/ffffff/-/format/jpeg/-/progressive/yes/'
            if (this.settings.previewUrlCallback) {
              src = this.settings.previewUrlCallback(src, info)
            }
            imgInfo = info.originalImageInfo
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
    return this.file.catch(
      ifCur((error, info) => {
        return this.__setState('error', {
          error,
          file: info
        })
      })
    )
  }

  __tryToLoadImagePreview(file, blob) {
    return new Promise((resolve, reject) => {
      if (
        !blob.size ||
        blob.size >= this.settings.multipartMinSize
      ) {
        return reject(Error('!blob.size'))
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
            var src
            resolve()
            canvas.width = canvas.height = 1
            if (
              // file.state() !== 'pending' ||
              this.dialogApi.state() !== 'pending' ||
              this.file !== file
            ) {
              return
            }
            src = URL.createObjectURL(blob)
            this.dialogApi.always(function() {
              return URL.revokeObjectURL(src)
            })
            console.log(this.__state)
            if (this.__state !== 'image') {
              this.__setState('image', {
                src,
                name: ''
              })
              return this.initImage(size)
            }
          })
        })
        .catch(reject)
    })
  }

  __tryToLoadVideoPreview(file, blob) {
    return new Promise((resolve, reject) => {
      if (!URL || !blob.size) {
        reject(Error('url'))
      }
      const src = URL.createObjectURL(blob)

      videoLoader(src)
        .then(() => {
          resolve()
          this.dialogApi.always(function() {
            return URL.revokeObjectURL(src)
          })
          this.__setState('video')
          const videoTag = this.container.querySelector(
            '.uploadcare--preview__video'
          )
          // hack to enable seeking due to bug in MediaRecorder API
          // https://bugs.chromium.org/p/chromium/issues/detail?id=569840
          videoTag.addEventListener('loadeddata', function loadedHandler() {
            videoTag.currentTime = 360000 // 100 hours
            videoTag.removeEventListener('loadeddata', loadedHandler)
          })
          videoTag.addEventListener('ended', function endedHandler() {
            videoTag.currentTime = 0
            videoTag.removeEventListener('ended', endedHandler)
          })
          // end of hack

          videoTag.src = src
          // hack to load first-frame poster on ios safari
          videoTag.load()
        })
        .catch(() => {
          URL.revokeObjectURL(src)
        })
    })
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
      .filter(className => className.indexOf('uploadcare--preview_status_'))
      .forEach(classToRemove => {
        this.container.classList.remove(classToRemove)
      })

    if (state === 'unknown' && this.settings.crop) {
      this.container.querySelector('.uploadcare--preview__done').style.display = 'none'
    }

    if (state === 'error') {
      this.container.classList.add('uploadcare--preview_status_error-' + data.error)
    }

    const done = this.container.querySelector('.uploadcare--preview__done')
    done && done.focus()
  }

  initImage(imgSize, cdnModifiers) {
    // let done
    // let imgLoader
    // let startCrop

    const img = this.container.querySelector('.uploadcare--preview__image')
    // done = this.container.find('.uploadcare--preview__done')
    return imageLoader(img)
      .then(() => {
        return this.container.classList.add('uploadcare--preview_status_loaded')
      })
      .catch(() => {
        this.file = null
        return this.__setState('error', {
          error: 'loadImage'
        })
      })

    // const startCrop = () => {
    //   this.container
    //     .find('.uploadcare--crop-sizes__item')
    //     .attr('aria-disabled', false)
    //     .attr('tabindex', 0)
    //   done.attr('disabled', false).attr('aria-disabled', false)
    //   this.widget = new CropWidget(img, imgSize, this.settings.crop[0])
    //   if (cdnModifiers) {
    //     this.widget.setSelectionFromModifiers(cdnModifiers)
    //   }
    //   return done.on('click', () => {
    //     var newFile
    //     newFile = this.widget.applySelectionToFile(this.file)
    //     this.dialogApi.fileColl.replace(this.file, newFile)
    //     return true
    //   })
    // }
    // if (this.settings.crop) {
    //   this.container
    //     .find('.uploadcare--preview__title')
    //     .text(locale.t('dialog.tabs.preview.crop.title'))
    //   this.container
    //     .find('.uploadcare--preview__content')
    //     .addClass('uploadcare--preview__content_crop')
    //   done.attr('disabled', true).attr('aria-disabled', true)
    //   done.text(locale.t('dialog.tabs.preview.crop.done'))
    //   this.populateCropSizes()
    //   this.container
    //     .find('.uploadcare--crop-sizes__item')
    //     .attr('aria-disabled', true)
    //     .attr('tabindex', -1)
    //   return imgLoader.done(function() {
    //     // Often IE 11 doesn't do reflow after image.onLoad
    //     // and actual image remains 28x30 (broken image placeholder).
    //     // Looks like defer always fixes it.
    //     return defer(startCrop)
    //   })
    // }
  }

  // populateCropSizes() {
  //   const control = this.container.find('.uploadcare--crop-sizes')
  //   const template = control.children()
  //   const currentClass = 'uploadcare--crop-sizes__item_current'
  //   each(this.settings.crop, (i, crop) => {
  //     var caption, gcd, icon, item, prefered, size
  //     prefered = crop.preferedSize
  //     if (prefered) {
  //       gcd = calcGCD(prefered[0], prefered[1])
  //       caption = `${prefered[0] / gcd}:${prefered[1] / gcd}`
  //     } else {
  //       caption = locale.t('dialog.tabs.preview.crop.free')
  //     }
  //     item = template
  //       .clone()
  //       .appendTo(control)
  //       .attr('data-caption', caption)
  //       .on('click', e => {
  //         if (e.currentTarget.getAttribute('aria-disabled') === 'true') {
  //           return
  //         }
  //         if (
  //           !e.currentTarget.classList.contains(currentClass) &&
  //           this.settings.crop.length > 1 &&
  //           this.widget
  //         ) {
  //           this.widget.setCrop(crop)
  //           control.find('>*').classList.remove(currentClass)
  //           item.classList.add(currentClass)
  //         }
  //       })
  //     if (prefered) {
  //       size = fitSize(prefered, [30, 30], true)
  //       return item.children().css({
  //         width: Math.max(20, size[0]),
  //         height: Math.max(12, size[1])
  //       })
  //     } else {
  //       icon = parseHTML(
  //         "<svg width='32' height='32'><use xlink:href='#uploadcare--icon-crop-free'/></svg>"
  //       )
  //         .setAttribute('role', 'presentation')
  //         .setAttribute('class', 'uploadcare--icon')
  //       return item
  //         .children()
  //         .append(icon)
  //         .addClass('uploadcare--crop-sizes__icon_free')
  //     }
  //   })
  //   template.remove()
  //
  //   return control
  //     .find('>*')
  //     .eq(0)
  //     .addClass(currentClass)
  // }

  displayed() {
    this.container.querySelector('.uploadcare--preview__done').focus()
  }
}

export { PreviewTab }
