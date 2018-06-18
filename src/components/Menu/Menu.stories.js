/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Menu} from './Menu'

storiesOf('Components/Link', module)
  .add('default', () => <Menu>Menu</Menu>)
