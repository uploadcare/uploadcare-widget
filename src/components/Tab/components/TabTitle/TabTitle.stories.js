/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {TabTitle} from './TabTitle'

storiesOf('Components/Tab/TabTitle', module)
  .add('default', () => <TabTitle>Tab Content</TabTitle>)
