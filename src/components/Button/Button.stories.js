import {storiesOf} from '@zmoki/storybook-hyperapp'
import {h} from 'hyperapp'
import {Button} from './Button'

storiesOf('Components/Button', module)
  .add('default', () => <Button>Default button</Button>)
  .add('icon', () => <Button icon='icon'>Button with icon</Button>)
  .add('muted', () => <Button isMuted>Muted button</Button>)
  .add('overlay', () => <Button isOverlay>Overlay button</Button>)
  .add('primary', () => <Button isPrimary>Primary button</Button>)
  .add('size big', () => <Button size='big'>Big button</Button>)
  .add('size small', () => <Button size='small'>Small button</Button>)
