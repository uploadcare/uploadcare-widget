/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Widget} from './Widget'

storiesOf('Components/Widget', module)
  .add('default', () => <Widget />)
  .add('status=started', () => <Widget status='started' progressValue='40' />)
  .add('status=loaded', () => <Widget status='loaded' file={{
    name: 'test.png',
    size: '40 KB',
  }} />)
  .add('status=error', () => <Widget status='error' errorMessage='Can‘t upload' />)
