/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {CameraTab} from './CameraTab'

storiesOf('Components/CameraTab', module)
  .add('default', () => <CameraTab />)
