/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {CropWidget} from './CropWidget'

storiesOf('Components/CropWidget', module)
  .add('default', () => <CropWidget />)
