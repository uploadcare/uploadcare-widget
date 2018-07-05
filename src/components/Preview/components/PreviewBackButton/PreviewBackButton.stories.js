/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PreviewBackButton} from './PreviewBackButton'

storiesOf('Components/Preview/PreviewBackButton', module)
  .add('default', () => <PreviewBackButton>Preview Back Button</PreviewBackButton>)
