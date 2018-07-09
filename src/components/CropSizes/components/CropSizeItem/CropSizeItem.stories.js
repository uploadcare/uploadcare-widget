/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {CropSizeItem} from './CropSizeItem'

storiesOf('Components/CropSizes/CropSizeItem', module)
  .add('free current', () => (
    <CropSizeItem
      isCurrent
      caption='free'
      withIcon='crop-free' />
  ))
  .add('free', () => (
    <CropSizeItem
      caption='free'
      withIcon='crop-free' />
  ))
  .add('1:1', () => (
    <CropSizeItem
      caption='1:1' />
  ))
  .add('4:3', () => (
    <CropSizeItem
      caption='4:3' />
  ))
  .add('16:9', () => (
    <CropSizeItem
      caption='16:9' />
  ))
