/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Video} from './Video'

storiesOf('Components/Media/Video', module)
  .add('default', () => <Video />)
