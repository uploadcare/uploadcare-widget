/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {DragAndDropTitle} from './DragAndDropTitle'

storiesOf('Components/DragAndDrop/DragAndDropTitle', module)
  .add('default', () => <DragAndDropTitle>Drag And Drop Title</DragAndDropTitle>)
