/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {SVG} from './SVG'

storiesOf('Components/SVG', module)
  .add('default', () => <SVG />)
