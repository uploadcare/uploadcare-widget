/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {WidgetFile} from './WidgetFile'

storiesOf('Components/Widget/WidgetFile', module)
  .add('default', () => (
    <WidgetFile
      name='test-name.svg'
      size='20 KB' />
  ))
