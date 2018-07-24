/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PreviewTitle} from './PreviewTitle'

storiesOf('Components/Preview/PreviewTitle', module)
  .add('default', () => <PreviewTitle>Preview Title</PreviewTitle>)
