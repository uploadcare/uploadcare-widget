/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PreviewContent} from './PreviewContent'

storiesOf('Components/Preview/PreviewContent', module)
  .add('default', () => <PreviewContent>Preview Content</PreviewContent>)
