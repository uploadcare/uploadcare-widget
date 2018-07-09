/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Menu} from './Menu'

storiesOf('Components/Menu', module)
  .add('default', () => (
    <Menu
      items={[
        {
          title: 'Local files',
          iconName: 'file',
        },
      ]} />
  ))
