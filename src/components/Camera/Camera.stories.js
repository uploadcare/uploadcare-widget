import {storiesOf} from '@zmoki/storybook-hyperapp'
import {h} from 'hyperapp'
import {Camera} from './Camera'

storiesOf('Components/Camera', module)
  .add('default', () => <Camera />)
