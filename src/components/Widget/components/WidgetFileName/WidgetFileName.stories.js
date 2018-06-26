/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {WidgetFileName} from './WidgetFileName'

storiesOf('Components/Widget/WidgetFileName', module)
  .add('default', () => (
    <WidgetFileName
      name='Widget File Name'
      size='20 KB' />
  ))
