/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {WidgetButton} from './WidgetButton'

storiesOf('Components/Widget/WidgetButton', module)
  .add('default', () => (<WidgetButton>Click me</WidgetButton>))
  .add('type=open', () => (<WidgetButton type='open'>Click me</WidgetButton>))
