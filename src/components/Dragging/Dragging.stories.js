/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Dragging} from './Dragging'

storiesOf('Components/Dragging', module)
  .add('default', () => <Dragging>Default text</Dragging>)
