/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Files} from './Files'

storiesOf('Components/Files', module)
  .add('default', () => <Files>Files</Files>)
