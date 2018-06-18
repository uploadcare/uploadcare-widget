import {storiesOf} from '@zmoki/storybook-hyperapp'
import {h} from 'hyperapp'
import {Input} from './Input'

storiesOf('Components/Input', module)
  .add('default', () => <Input />)
  .add('type=file', () => <Input className={'example'} type='file' />)
