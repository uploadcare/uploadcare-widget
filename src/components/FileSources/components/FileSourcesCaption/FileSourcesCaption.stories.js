/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {FileSourcesCaption} from './FileSourcesCaption'

storiesOf('Components/FileSources/FileSourcesCaption', module)
  .add('default', () => <FileSourcesCaption>File sources Caption</FileSourcesCaption>)
