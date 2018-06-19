/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Widget} from './Widget'

storiesOf('Components/Widget', module)
  .add('default', () => <Widget>Default text</Widget>)

