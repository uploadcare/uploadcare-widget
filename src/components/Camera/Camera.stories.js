import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Camera} from './Camera'

storiesOf('Components/Camera', module)
  .add('default', () => <Camera />)
