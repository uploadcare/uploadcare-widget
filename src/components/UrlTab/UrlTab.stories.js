/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {UrlTab} from './UrlTab'

storiesOf('Components/UrlTab', module)
  .add('default', () => <UrlTab />)
