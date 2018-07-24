/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Image} from './Image'

storiesOf('Components/Media/Image', module)
  .add('default', () => <Image src='' />)
