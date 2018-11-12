/* @flow */
/* @jsx h */

import {h, app} from 'hyperapp'
import nanoid from 'nanoid'
import {withLocales} from './i18n'

const DEFAULT_BINDERS_SELECTOR = '.uploadcare-uploader'

const state = {}
const actions = {}

const Uploader = ({locale}) => (
  <div>
    Uploader will be here. Current locale is {locale}.
  </div>
)

type BoundUploader = {|
  id: string,
|}

/**
 * Creates before the Binder element the new DOM element that contain Uploader.
 * Saves the id of Uploader to the data attribute of Binder.
 * If Binder contains the id of existing Uploader, skips creating.
 *
 * @param {HTMLElement} $binder – The Binder element.
 * @returns {(BoundUploader|null)} – The created or existing Uploader.
 */
function createUploader($binder: HTMLElement): BoundUploader | null {
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

  withLocales(app)(state, actions, Uploader, $uploader)

  return {id}
}

/**
 * Creates as many Uploaders as Binders in the Container element.
 *
 * @param {HTMLElement} [$container] – The Container element, by default is body of the page.
 * @returns {Array<BoundUploader>} – The list of Uploaders.
 */
function init($container?: HTMLElement = document.body): Array<BoundUploader> {
  const $binders = $container.querySelectorAll(DEFAULT_BINDERS_SELECTOR)

  return Array.from($binders)
    .reduce((uploaders, $binder) => {
      const uploader = createUploader($binder)

      if (uploader === null) {
        return
      }

      $binder.dataset.uploaderId = uploader.id
      $binder.hidden = true

      uploaders.push(uploader)
    }, [])
}

init()
