/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {ProgressBar} from './ProgressBar'

storiesOf('Components/ProgressBar', module)
  .add('default', () => <ProgressBar />)
