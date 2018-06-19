/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Input} from './Input'

storiesOf('Components/Input', module)
  .add('default', () => <Input />)
  .add('type=file', () => <Input type='file' />)
