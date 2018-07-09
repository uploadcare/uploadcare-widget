/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PreviewMultiple} from './PreviewMultiple'

storiesOf('Components/PreviewMultiple', module)
  .add('default', () => <PreviewMultiple />)
