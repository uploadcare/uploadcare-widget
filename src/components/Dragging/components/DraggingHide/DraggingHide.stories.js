/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {DraggingHide} from './DraggingHide'

storiesOf('Components/Dragging/DraggingHide', module)
  .add('default', () => <DraggingHide>Default text</DraggingHide>)
