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
    return $binder.dataset.uploaderId
  }

  const {parentNode} = $binder

  if (!parentNode) {
    return null
  }

  const uploaderName = 'uploadcare--uploader'
  const uploaderId = `${uploaderName}-${nanoid()}`
  const $uploader = document.createElement('div')

  $uploader.id = uploaderId
  $uploader.classList.add(uploaderName)

  parentNode.insertBefore($uploader, $binder)

  app(state, actions, Uploader, $uploader)

  return uploaderId
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
      const uploaderId = createUploader($binder)

      $binder.dataset.uploaderId = uploaderId
      $binder.hidden = true

      return uploaderId
    })
    .filter(id => id !== null)
}

init()
