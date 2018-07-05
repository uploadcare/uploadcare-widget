/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PreviewError} from './PreviewError'

storiesOf('Components/Preview/PreviewError', module)
  .add('default', () => <PreviewError error='error' />)
