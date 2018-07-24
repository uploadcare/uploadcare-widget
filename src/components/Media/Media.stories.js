/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Media} from './Media'

storiesOf('Components/Media', module)
  .add('default', () => <Media />)
