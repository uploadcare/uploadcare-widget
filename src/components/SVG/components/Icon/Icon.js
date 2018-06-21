/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Icon.css'
import * as Icons from './icons/index'

import type {Props} from './flow-typed'

export const Icon = ({className, name}: Props) => {
  let IconComponent

  switch (name) {
  case 'back':
    IconComponent = Icons.IconBack
    break
  case 'box':
    IconComponent = Icons.IconBox
    break
  case 'camera':
    IconComponent = Icons.IconCamera
    break
  case 'close':
    IconComponent = Icons.IconClose
    break
  case 'crop-free':
    IconComponent = Icons.IconCropFree
    break
  case 'dropbox':
    IconComponent = Icons.IconDropbox
    break
  case 'empty-public-key':
    IconComponent = Icons.IconEmptyPublicKey
    break
  case 'error':
    IconComponent = Icons.IconError
    break
  case 'evernote':
    IconComponent = Icons.IconEvernote
    break
  case 'facebook':
    IconComponent = Icons.IconFacebook
    break
  case 'file':
    IconComponent = Icons.IconFile
    break
  case 'flickr':
    IconComponent = Icons.IconFlickr
    break
  case 'google-drive':
    IconComponent = Icons.IconGoogleDrive
    break
  case 'google-photos':
    IconComponent = Icons.IconGooglePhotos
    break
  case 'huddle':
    IconComponent = Icons.IconHuddle
    break
  case 'instagram':
    IconComponent = Icons.IconInstagram
    break
  case 'menu':
    IconComponent = Icons.IconMenu
    break
  case 'more':
    IconComponent = Icons.IconMore
    break
  case 'remove':
    IconComponent = Icons.IconRemove
    break
  case 'skydrive':
    IconComponent = Icons.IconSkyDrive
    break
  case 'uploadcare':
    IconComponent = Icons.IconUploadcare
    break
  case 'url':
    IconComponent = Icons.IconUrl
    break
  case 'vk':
    IconComponent = Icons.IconVK
    break
  }

  return <IconComponent className={cn(styles.icon, className)} />
}
