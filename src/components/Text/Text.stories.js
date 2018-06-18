import {storiesOf} from '@zmoki/storybook-hyperapp'
import {h} from 'hyperapp'
import {Text} from './Text'

storiesOf('Components/Text', module)
  .add('default', () => <Text>Default text</Text>)
  .add('muted', () => <Text isMuted>Muted text</Text>)
  .add('pre', () => <Text isPre>Pre text</Text>)
  .add('small', () => <Text size='small'>Small text</Text>)
  .add('medium', () => <Text size='medium'>Medium text</Text>)
  .add('large', () => <Text size='large'>Large text</Text>)
  .add('extra large', () => <Text size='extra-large'>Extra large text</Text>)
