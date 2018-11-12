/* @flow */
/* @jsx h */

import {h, app} from 'hyperapp'
import nanoid from 'nanoid'

const DEFAULT_BINDERS_SELECTOR = '.uploadcare-uploader'

const state = {}
const actions = {}

const Uploader = () => (
  <div>
    Uploader will be here
  </div>
)

/**
 * Creates before the Binder element the new DOM element that contain Uploader.
 * Saves the id of Uploader to the data attribute of Binder.
 * If Binder contains the id of existing Uploader, skips creating.
 *
 * @param {HTMLElement} $binder – The Binder element.
 * @returns {(string|null)} – The id of created or existing Uploader.
 */
function createUploader($binder: HTMLElement): string | null {
  if ($binder.dataset.uploaderId && document.getElementById($binder.dataset.uploaderId)) {
    return {id: $binder.dataset.uploaderId}
  }

  const {parentNode} = $binder

  if (!parentNode) {
    return null
  }

  const name = 'uploadcare--uploader'
  const id = `${name}-${nanoid()}`
  const $uploader = document.createElement('div')

  $uploader.id = id
  $uploader.classList.add(name)

  parentNode.insertBefore($uploader, $binder)

  app(state, actions, Uploader, $uploader)

  return {id}
}

/**
 * Creates as many Uploaders as Binders in the Container element.
 *
 * @param {HTMLElement} [$container] – The Container element, by default is body of the page.
 * @returns {Array<string>} – The list of ids of Uploaders.
 */
function init($container: HTMLElement | null = document.body): Array<string> {
  if (!$container) {
    return
  }

  const $binders = $container.querySelectorAll(DEFAULT_BINDERS_SELECTOR)

  return Array.from($binders)
    .map($binder => {
      const uploader = createUploader($binder)

      $binder.dataset.uploaderId = uploader.id
      $binder.hidden = true

      return uploader
    })
    .filter(id => id !== null)
}

init()
