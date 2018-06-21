/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {File} from './File'

storiesOf('Components/File', module)
  .add('default', () => <File />)
