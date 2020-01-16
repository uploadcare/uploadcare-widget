import { tpl } from '../../templates'
import { parseHTML } from '../../utils'

// starts with scheme
const urlRegexp = /^[a-z][a-z0-9+\-.]*:?\/\//

const fixUrl = function(url) {
  url = url.trim && url.trim()
  if (urlRegexp.test(url)) {
    return url
  } else {
    return 'http://' + url
  }
}

class UrlTab {
  constructor(container, tabButton, dialogApi, settings, name) {
    this.container = container
    this.tabButton = tabButton
    this.dialogApi = dialogApi
    this.settings = settings
    this.name = name
    this.container.appendChild(
      parseHTML(
        tpl('tab-url')
      )
    )

    const input = this.container.querySelector('.uploadcare--input')
    const button = this.container.querySelector('.uploadcare--button[type=submit]')

    button.setAttribute('disabled', true)
    button.setAttribute('aria-disabled', true)

    function inputHandler() {
      const isDisabled = !this.value.trim()

      button.setAttribute('disabled', isDisabled)
      button.setAttribute('aria-disabled', isDisabled)
    }

    input.addEventListener('change', inputHandler)
    input.addEventListener('keyup', inputHandler)
    input.addEventListener('input', inputHandler)

    const form = this.container.querySelector('.uploadcare--form')
    form.addEventListener('submit', () => {
      var url = fixUrl(input.val())

      if (url) {
        this.dialogApi.addFiles('url', [
          [
            url,
            {
              source: 'url-tab'
            }
          ]
        ])

        input.value = ''
      }

      return false
    })
  }

  displayed() {
    this.container.querySelector('.uploadcare--input').focus()
  }
}

export { UrlTab }
