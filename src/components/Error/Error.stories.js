/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Error} from './Error'

storiesOf('Components/Error', module)
  .add('default', () => <Error>Default error</Error>)
