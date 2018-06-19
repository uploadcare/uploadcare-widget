/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Footer, FooterButton} from './Footer'

storiesOf('Components/Footer', module)
  .add('default', () => <Footer/>)
  .add('button', () => <FooterButton>Footer Button</FooterButton>)
  .add('button primary', () => <FooterButton isPrimary>Footer Button</FooterButton>)
