/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {MouseFocused} from './MouseFocused'

storiesOf('Components/MouseFocused', module)
  .add('default', () => <MouseFocused>Menu</MouseFocused>)
