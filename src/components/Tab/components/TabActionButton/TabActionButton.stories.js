/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {TabActionButton} from './TabActionButton'

storiesOf('Components/Tab/TabActionButton', module)
  .add('default', () => <TabActionButton>Tab Action Button</TabActionButton>)
