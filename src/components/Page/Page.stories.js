/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Page} from './Page'

storiesOf('Components/Page', module)
  .add('default', () => <Page>Menu</Page>)
