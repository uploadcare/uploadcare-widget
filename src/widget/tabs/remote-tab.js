import { registerMessage, unregisterMessage } from '../../utils/messages'
import { warn, debug } from '../../utils/warnings'
import { globRegexp, parseHTML } from '../../utils'
import { html } from '../../utils/html'
// import { UrlFile } from '../../files/url'

import { version } from '../../../package.json'
import { uploadFile } from '@uploadcare/upload-client'

class RemoteTab {
  constructor(container, tabButton, dialogApi, settings, name1) {
    this.__createIframe = this.__createIframe.bind(this)
    this.container = container
    this.tabButton = tabButton
    this.dialogApi = dialogApi
    this.settings = settings
    this.name = name1

    this.dialogApi.progress(name => {
      if (name === this.name) {
        this.__createIframe()
        const iframe = this.container.querySelector('.uploadcare--tab__iframe')
        iframe && iframe.focus()
      }

      return this.__sendMessage({
        type: 'visibility-changed',
        visible: name === this.name
      })
    })
  }

  remoteUrl() {
    const search = new URLSearchParams()

    search.append('lang', this.settings.locale)
    search.append('public_key', this.settings.publicKey)
    search.append('widget_version', version)
    search.append('images_only', this.settings.imagesOnly)
    search.append('pass_window_open', this.settings.passWindowOpen)

    return `${this.settings.socialBase}/window3/${this.name}?${search}`
  }

  __sendMessage(messageObj) {
    const iframeWindow = this.iframe && this.iframe.contentWindow
    iframeWindow && iframeWindow.postMessage(JSON.stringify(messageObj), '*')
  }

  __createIframe() {
    if (this.iframe) {
      return
    }

    this.iframe = parseHTML(
      html`
        <iframe
          src="${this.remoteUrl()}"
          class="uploadcare--tab__iframe"
          marginheight="0"
          marginwidth="0"
          frameborder="0"
          allowtransparency="true"
        ></iframe>
      `
    )

    this.container.appendChild(this.iframe)

    this.iframe.addEventListener('load', () => {
      this.iframe.style.opacity = 1
    })

    this.container.classList.add('uploadcare--tab_remote')

    const iframe = this.iframe.contentWindow

    registerMessage('file-selected', iframe, message => {
      const url = (() => {
        var i, key, len, ref, type
        if (message.alternatives) {
          ref = this.settings.preferredTypes
          for (i = 0, len = ref.length; i < len; i++) {
            type = ref[i]
            type = globRegexp(type)
            for (key in message.alternatives) {
              if (type.test(key)) {
                return message.alternatives[key]
              }
            }
          }
        }
        return message.url
      })()

      // const sourceInfo = Object.assign(
      //   {
      //     source: this.name
      //   },
      //   message.info || {}
      // )

      // const file = new UrlFile(url, this.settings, sourceInfo)
      const file = uploadFile(url, this.settings)

      if (message.filename) {
        // file.setName(message.filename)
        file.name = message.filename
      }

      if (message.is_image != null) {
        // file.setIsImage(message.is_image)
        file.isImage = message.is_image
      }

      this.dialogApi.addFiles([file.promise()])
    })

    registerMessage('open-new-window', iframe, message => {
      if (this.settings.debugUploads) {
        debug('Open new window message.', this.name)
      }

      const popup = window.open(message.url, '_blank')

      if (!popup) {
        warn("Can't open new window. Possible blocked.", this.name)
        return
      }

      const resolve = () => {
        if (this.settings.debugUploads) {
          debug('Window is closed.', this.name)
        }
        return this.__sendMessage({
          type: 'navigate',
          fragment: ''
        })
      }

      // Detect is window supports "closed".
      // In browsers we have only "closed" property.
      // In Cordova addEventListener('exit') does work.
      if ('closed' in popup) {
        const interval = setInterval(() => {
          if (popup.closed) {
            clearInterval(interval)
            return resolve()
          }
        }, 100)
      } else {
        popup.addEventListener('exit', resolve)
      }
    })

    return this.dialogApi.then(() => {
      unregisterMessage('file-selected', iframe)
      return unregisterMessage('open-new-window', iframe)
    })
  }
}

export { RemoteTab }
