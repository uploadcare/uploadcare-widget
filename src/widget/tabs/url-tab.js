import $ from 'jquery'
import { tpl } from '../../templates'

var fixUrl, urlRegexp

class UrlTab {
  constructor(container, tabButton, dialogApi, settings, name) {
    var button, input
    this.container = $(container)
    this.tabButton = $(tabButton)
    this.dialogApi = dialogApi
    this.settings = settings
    this.name = name
    this.container.append(tpl('tab-url'))

    input = this.container.find('.uploadcare--input')
    input.on('change keyup input', function() {
      var isDisabled = !$.trim(this.value)
      return button
        .attr('disabled', isDisabled)
        .attr('aria-disabled', isDisabled)
    })

    button = this.container
      .find('.uploadcare--button[type=submit]')
      .attr('disabled', true)

    this.container.find('.uploadcare--form').on('submit', () => {
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

        input.val('').trigger('change')
      }
      return false
    })
  }

  displayed() {
    this.container.find('.uploadcare--input').focus()
  }
}

// starts with scheme
urlRegexp = /^[a-z][a-z0-9+\-.]*:?\/\//

fixUrl = function(url) {
  url = $.trim(url)
  if (urlRegexp.test(url)) {
    return url
  } else {
    return 'http://' + url
  }
}

export { UrlTab }
