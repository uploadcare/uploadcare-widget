/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {FooterAdditions} from './FooterAdditions'

storiesOf('Components/Footer/FooterAdditions', module)
  .add('default', () => <FooterAdditions>Footer Additions</FooterAdditions>)
