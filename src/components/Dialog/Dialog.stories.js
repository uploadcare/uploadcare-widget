/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Dialog} from './Dialog'

storiesOf('Components/Dialog', module)
  .add('default', () => <Dialog />)
