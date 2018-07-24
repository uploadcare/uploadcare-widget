/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {PreviewFile} from './PreviewFile'

storiesOf('Components/Preview/PreviewFile', module)
  .add('default', () => (
    <PreviewFile
      fileName='FileName.jpg'
      fileSize={1024} />
  ))
