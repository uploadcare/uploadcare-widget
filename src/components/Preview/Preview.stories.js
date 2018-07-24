/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Preview} from './Preview'

storiesOf('Components/Preview', module)
  .add('default', () => <Preview>Preview</Preview>)
