/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {WidgetButton} from './WidgetButton'

storiesOf('Components/Widget/WidgetButton', module)
  .add('default', () => (
    <WidgetButton
      name='open'
      caption='Widget Button' />
  ))
