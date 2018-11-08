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

const createUploader = ($binder) => {
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

const init = ($container: HTMLElement | null = document.body) => {
  if (!$container) {
    return
  }

  const $binders = $container.querySelectorAll(DEFAULT_BINDERS_SELECTOR)

  Array.from($binders).forEach($binder => {
    if ($binder.dataset.uploaderId && document.getElementById($binder.dataset.uploaderId)) {
      return
    }

    $binder.dataset.uploaderId = createUploader($binder)
    $binder.hidden = true
  })
}

init()
