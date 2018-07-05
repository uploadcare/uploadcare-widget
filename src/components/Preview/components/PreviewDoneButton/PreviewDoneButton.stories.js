/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PreviewDoneButton} from './PreviewDoneButton'

storiesOf('Components/Preview/PreviewBackButton', module)
  .add('default', () => <PreviewDoneButton>Preview Done Button</PreviewDoneButton>)
