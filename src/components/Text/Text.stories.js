/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Text} from './Text'

storiesOf('Components/Text', module)
  .add('default', () => <Text>Default text</Text>)
  .add('isMuted', () => <Text isMuted>Muted text</Text>)
  .add('isPre', () => <Text isPre>Pre text</Text>)
  .add('small', () => <Text size='small'>Small text</Text>)
  .add('medium', () => <Text size='medium'>Medium text</Text>)
  .add('large', () => <Text size='large'>Large text</Text>)
  .add('extra', () => <Text size='extra'>Extra large text</Text>)

