/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Icon} from './Icon'

storiesOf('Components/Icon', module)
  .add('default', () => <Icon>Link</Icon>)
