/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {TabHeader} from './TabHeader'

storiesOf('Components/Tab/TabHeader', module)
  .add('default', () => <TabHeader>Tab Header</TabHeader>)
