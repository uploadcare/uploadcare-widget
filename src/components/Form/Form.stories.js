/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Form} from './Form'

storiesOf('Components/Form', module)
  .add('default', () => <Form>Form</Form>)
