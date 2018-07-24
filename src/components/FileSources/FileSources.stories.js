/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {FileSources} from './FileSources'

storiesOf('Components/FileSources', module)
  .add('default', () => <FileSources>File sources</FileSources>)
