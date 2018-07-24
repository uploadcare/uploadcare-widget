/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PoweredBy} from './PoweredBy'

storiesOf('Components/PoweredBy', module)
  .add('default', () => <PoweredBy version='4.0.0'/>)
