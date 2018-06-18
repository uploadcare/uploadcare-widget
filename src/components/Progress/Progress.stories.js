/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Progress} from './Progress'

storiesOf('Components/Progress', module)
  .add('default', () => <Progress />)
