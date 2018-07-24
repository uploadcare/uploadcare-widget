/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Footer} from './Footer'

storiesOf('Components/Footer', module)
  .add('default', () => <Footer/>)
