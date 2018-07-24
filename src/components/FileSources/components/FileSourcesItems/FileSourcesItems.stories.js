/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {FileSourcesItems} from './FileSourcesItems'

storiesOf('Components/FileSources/FileSourcesItems', module)
  .add('default', () => <FileSourcesItems>File sources items</FileSourcesItems>)
