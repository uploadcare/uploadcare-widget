/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {MenuItem} from './MenuItem'

storiesOf('Components/MenuItem', module)
  .add('default', () => (
    <MenuItem
      title='Local files'
      iconName='file' />
  ))
  .add('isCurrent', () => (
    <MenuItem
      isCurrent
      title='Local files'
      iconName='file' />
  ))
  .add('isHidden', () => (
    <MenuItem
      isHidden
      title='Local files'
      iconName='file' />
  ))
