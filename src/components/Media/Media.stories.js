import {storiesOf} from '@zmoki/storybook-hyperapp'
import {h} from 'hyperapp'
import {Media, Video} from './Media'

storiesOf('Components/Media', module)
  .add('media', () => <Media />)
  .add('with video', () => (
    <Media>
      <Video />
    </Media>
  ))
