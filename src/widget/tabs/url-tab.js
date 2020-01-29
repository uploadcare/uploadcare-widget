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

      if (isDisabled) {
        button.setAttribute('disabled', '')
        button.setAttribute('aria-disabled', '')
      } else {
        button.removeAttribute('disabled')
        button.removeAttribute('aria-disabled')
      }
    }

    input.addEventListener('change', inputHandler)
    input.addEventListener('keyup', inputHandler)
    input.addEventListener('input', inputHandler)

    const form = this.container.querySelector('.uploadcare--form')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      var url = fixUrl(input.value)

      if (url) {
        this.dialogApi.addFiles('url', [
          [
            url
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
