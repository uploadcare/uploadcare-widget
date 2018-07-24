/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PreviewUnknown} from './PreviewUnknown'

storiesOf('Components/Preview/PreviewUnknown', module)
  .add('default', () => <PreviewUnknown fileName='UnknownFileName.jpg' />)
