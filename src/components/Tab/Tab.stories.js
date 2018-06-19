/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Tab} from './Tab'

storiesOf('Components/Tab', module)
  .add('default', () => <Tab />)
