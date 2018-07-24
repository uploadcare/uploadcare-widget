/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {TabContent} from './TabContent'

storiesOf('Components/Tab/TabContent', module)
  .add('default', () => <TabContent>Tab Content</TabContent>)
