/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {FooterButton} from './FooterButton'

storiesOf('Components/Footer/FooterButton', module)
  .add('default', () => <FooterButton>Footer Button</FooterButton>)
