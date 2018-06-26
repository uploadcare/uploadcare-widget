/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {DragAndDrop} from './DragAndDrop'

storiesOf('Components/DragAndDrop', module)
  .add('default', () => <DragAndDrop>Drag And Drop</DragAndDrop>)
