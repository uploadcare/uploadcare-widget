/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {DragAndDropSupported} from './DragAndDropSupported'

storiesOf('Components/DragAndDrop/DragAndDropSupported', module)
  .add('default', () => <DragAndDropSupported>Drag And Drop Supported</DragAndDropSupported>)
