import $ from 'jquery'
import { socialSources } from './social-sources'
import { registerMessage, unregisterMessage } from './utils/messages'
import { build } from './settings'

function getSourceUrl(sourceName, publicKey, socialBase) {
  return `${socialBase}/window3/${sourceName}?public_key=${publicKey}`
}

export function logout(sources = socialSources, publicKey) {
  const df = $.Deferred()
  const settings = build({})

  const url = getSourceUrl(
    sources[0],
    publicKey || settings.publicKey,
    settings.socialBase
  )
  const timeout = 15 * 1000
  const timeoutId = setTimeout(() => {
    df.reject(new Error(`Logout timeout expired`))
  }, timeout)

  const iframeEl = $('<iframe>', {
    src: url,
    allowTransparency: 'true'
  })
    .css({
      opacity: 0,
      width: 0,
      height: 0,
      visibility: 'hidden',
      position: 'absolute'
    })
    .appendTo('body')
    .on('load', () => {
      const iframeWindow = iframeEl[0].contentWindow
      registerMessage('logout-from-success', iframeWindow, (message) => {
        unregisterMessage('logout-from-success', iframeWindow)
        iframeEl.remove()
        clearTimeout(timeoutId)
        df.resolve(message.sources)
      })
      registerMessage('logout-from-failed', iframeWindow, (message) => {
        unregisterMessage('logout-from-failed', iframeWindow)
        iframeEl.remove()
        clearTimeout(timeoutId)
        df.reject(message.error)
      })
      iframeWindow.postMessage(
        JSON.stringify({ type: 'logout-from', sources }),
        '*'
      )
    })

  return df.promise()
}
