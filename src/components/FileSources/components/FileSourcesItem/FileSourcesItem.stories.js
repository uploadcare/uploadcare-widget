/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {FileSourcesItem} from './FileSourcesItem'

storiesOf('Components/FileSources/FileSourcesItem', module)
  .add('default', () => <FileSourcesItem />)
