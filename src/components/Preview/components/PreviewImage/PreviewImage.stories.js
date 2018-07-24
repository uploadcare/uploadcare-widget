/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PreviewImage} from './PreviewImage'

storiesOf('Components/Preview/PreviewImage', module)
  .add('default', () => <PreviewImage src='123.jpg'/>)
