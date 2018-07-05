/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {TabFooter} from './TabFooter'

storiesOf('Components/Tab/TabFooter', module)
  .add('default', () => <TabFooter>Tab Footer</TabFooter>)
