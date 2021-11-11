import $ from 'jquery'

import { registerMessage, unregisterMessage } from '../../utils/messages'
import { warn, debug } from '../../utils/warnings'
import { globRegexp, parseQuery } from '../../utils'
import { UrlFile } from '../../files/url'
import { CssCollector } from '../../settings'

import { version } from '../../../package.json'

const tabsCss = new CssCollector()

/*
 * See Google Drive possible mime types here:
 * https://developers.google.com/drive/api/v3/ref-export-formats?hl=en
 *
 * Type `application/vnd.oasis.opendocument.spreadsheet` (without `x-` prefix)
 * isn't on this list, but it actually comes from their API.
 *
 * Docs is probably out of date, feedback has been sent.
 */
const googleDriveMimeTypeMapping = {
  'text/html': 'html',
  'application/zip': 'zip',
  'text/plain': 'txt',
  'application/rtf': 'rtf',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'application/epub+zip': 'epub',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/x-vnd.oasis.opendocument.spreadsheet': 'ods',
  'application/vnd.oasis.opendocument.spreadsheet': 'ods',
  'text/csv': 'csv',
  'text/tab-separated-values': 'tsv',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'pptx',
  'application/vnd.oasis.opendocument.presentation': 'odp',
  'application/vnd.google-apps.script+json': 'gs'
}

class RemoteTab {
  constructor(container, tabButton, dialogApi, settings, name1) {
    this.__createIframe = this.__createIframe.bind(this)
    this.container = container
    this.tabButton = tabButton
    this.dialogApi = dialogApi
    this.settings = settings
    this.name = name1
    this.dialogApi.progress((name) => {
      if (name === this.name) {
        this.__createIframe()
        this.container.find('.uploadcare--tab__iframe').focus()
      }

      return this.__sendMessage({
        type: 'visibility-changed',
        visible: name === this.name
      })
    })
  }

  remoteUrl() {
    return (
      `${this.settings.socialBase}/window3/${this.name}?` +
      $.param({
        lang: this.settings.locale,
        public_key: this.settings.publicKey,
        widget_version: version,
        images_only: this.settings.imagesOnly,
        pass_window_open: this.settings.passWindowOpen
      })
    )
  }

  __sendMessage(messageObj) {
    var ref, ref1
    return (ref = this.iframe) != null
      ? (ref1 = ref[0].contentWindow) != null
        ? ref1.postMessage(JSON.stringify(messageObj), '*')
        : undefined
      : undefined
  }

  __calculateFilename(sourceFilename, mimeType, url) {
    if (this.name === 'gdrive') {
      /*
       * Using `exportFormat` query key allows us to set filename
       * for gdrive files without `preferredTypes` option set.
       * But since it isn't documented and therefore not so reliable,
       * we fallback it with static mimeType -> extension mapping.
       */
      const googleApiLink = parseQuery(url).link
      const exportFormat = parseQuery(googleApiLink)?.exportFormat
      const ext = exportFormat || googleDriveMimeTypeMapping[mimeType]
      return ext ? `${sourceFilename}.${ext}` : sourceFilename
    }
    return sourceFilename
  }

  __createIframe() {
    var iframe
    if (this.iframe) {
      return
    }

    this.iframe = $('<iframe>', {
      src: this.remoteUrl(),
      marginheight: 0,
      marginwidth: 0,
      frameborder: 0,
      allowTransparency: 'true'
    })
      .addClass('uploadcare--tab__iframe')
      .appendTo(this.container)
      .on('load', () => {
        var i, j, len, len1, ref, ref1, style, url
        this.iframe.css('opacity', '1')
        ref = tabsCss.urls
        for (i = 0, len = ref.length; i < len; i++) {
          url = ref[i]
          this.__sendMessage({
            type: 'embed-css',
            url: url
          })
        }

        ref1 = tabsCss.styles
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          style = ref1[j]
          this.__sendMessage({
            type: 'embed-css',
            style: style
          })
        }
      })

    this.container.addClass('uploadcare--tab_remote')

    iframe = this.iframe[0].contentWindow

    registerMessage('file-selected', iframe, (message) => {
      let preferredType
      const url = (() => {
        if (message.alternatives) {
          const ref = this.settings.preferredTypes
          for (let i = 0, len = ref.length; i < len; i++) {
            let type = ref[i]
            type = globRegexp(type)
            for (const key in message.alternatives) {
              if (type.test(key)) {
                preferredType = key
                return message.alternatives[key]
              }
            }
          }
        }
        return message.url
      })()

      const sourceInfo = $.extend(
        {
          source: this.name
        },
        message.info || {}
      )

      const file = new UrlFile(url, this.settings, sourceInfo)
      if (message.filename) {
        const filename = this.__calculateFilename(
          message.filename,
          preferredType,
          url
        )
        file.setName(filename)
      }

      if (message.is_image != null) {
        file.setIsImage(message.is_image)
      }

      return this.dialogApi.addFiles([file.promise()])
    })

    registerMessage('open-new-window', iframe, (message) => {
      var interval, popup, resolve
      if (this.settings.debugUploads) {
        debug('Open new window message.', this.name)
      }
      popup = window.open(message.url, '_blank')
      if (!popup) {
        warn("Can't open new window. Possible blocked.", this.name)
        return
      }
      resolve = () => {
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
        interval = setInterval(() => {
          if (popup.closed) {
            clearInterval(interval)
            return resolve()
          }
        }, 100)

        return interval
      } else {
        return popup.addEventListener('exit', resolve)
      }
    })

    return this.dialogApi.done(() => {
      unregisterMessage('file-selected', iframe)
      return unregisterMessage('open-new-window', iframe)
    })
  }
}

export { RemoteTab, tabsCss }
