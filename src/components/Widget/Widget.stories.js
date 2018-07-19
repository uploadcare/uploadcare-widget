/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Widget} from './Widget'

storiesOf('Components/Widget', module)
  .add('default', () => (
    <div>
      <Widget status='ready' />
      <hr/>
      <Widget status='ready' clearable />
    </div>
  ))
  .add('status=started', () => (
    <div>
      <Widget status='started' progressValue='40' />
      <hr/>
      <Widget status='started' progressValue='40' clearable />
    </div>
  ))
  .add('status=loaded', () => (
    <div>
      <Widget status='loaded' file={{
        name: 'test.png',
        size: '40 KB',
      }} />
      <hr/>
      <Widget status='loaded' file={{
        name: 'test.png',
        size: '40 KB',
      }} clearable />
    </div>
  ))
  .add('status=error', () => (
    <div>
      <Widget status='error' errorMessage='Can‘t upload' />
      <hr/>
      <Widget status='error' errorMessage='Can‘t upload' clearable />
    </div>
  ))
