/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Icon} from './Icon'

storiesOf('Components/Icon', module)
  .add('back', () => <Icon name='back' />)
  .add('box', () => <Icon name='box' />)
  .add('camera', () => <Icon name='camera' />)
  .add('close', () => <Icon name='close' />)
  .add('crop-free', () => <Icon name='crop-free' />)
  .add('dropbox', () => <Icon name='dropbox' />)
  .add('empty-public-key', () => <Icon name='empty-public-key' />)
  .add('error', () => <Icon name='error' />)
  .add('evernote', () => <Icon name='evernote' />)
  .add('facebook', () => <Icon name='facebook' />)
  .add('file', () => <Icon name='file' />)
  .add('flickr', () => <Icon name='flickr' />)
  .add('google-drive', () => <Icon name='google-drive' />)
  .add('google-photos', () => <Icon name='google-photos' />)
  .add('huddle', () => <Icon name='huddle' />)
  .add('instagram', () => <Icon name='instagram' />)
  .add('menu', () => <Icon name='menu' />)
  .add('more', () => <Icon name='more' />)
  .add('remove', () => <Icon name='remove' />)
  .add('skydrive', () => <Icon name='skydrive' />)
  .add('uploadcare', () => <Icon name='uploadcare' />)
  .add('url', () => <Icon name='url' />)
  .add('vk', () => <Icon name='vk' />)
