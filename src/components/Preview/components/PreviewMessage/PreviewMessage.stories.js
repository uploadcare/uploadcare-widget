/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PreviewMessage} from './PreviewMessage'

storiesOf('Components/Preview/PreviewMessage', module)
  .add('default', () => <PreviewMessage>Preview Message</PreviewMessage>)
