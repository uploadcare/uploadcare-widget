/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PreviewVideo} from './PreviewVideo'

storiesOf('Components/Preview/PreviewVideo', module)
  .add('default', () => <PreviewVideo />)
