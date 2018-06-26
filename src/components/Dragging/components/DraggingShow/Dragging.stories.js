/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {DraggingShow} from './DraggingShow'

storiesOf('Components/Dragging/DraggingShow', module)
  .add('default', () => <DraggingShow>Default text</DraggingShow>)
