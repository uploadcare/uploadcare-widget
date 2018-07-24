/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {FileTab} from './FileTab'

storiesOf('Components/FileTab', module)
  .add('default', () => <FileTab />)
