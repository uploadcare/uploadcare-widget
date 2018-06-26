/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {DragAndDropNotSupported} from './DragAndDropNotSupported'

storiesOf('Components/DragAndDrop/DragAndDropNotSupported', module)
  .add('default', () => <DragAndDropNotSupported>Drag And Drop Not Supported</DragAndDropNotSupported>)
