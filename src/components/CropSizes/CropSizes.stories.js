/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {CropSizes} from './CropSizes'

storiesOf('Components/CropSizes', module)
  .add('default', () => <CropSizes>Default button</CropSizes>)
