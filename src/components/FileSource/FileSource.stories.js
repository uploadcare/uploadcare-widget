/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {FileSource} from './FileSource'

storiesOf('Components/FileSource', module)
  .add('default', () => <FileSource>Default button</FileSource>)
