/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {Panel} from './Panel'

storiesOf('Components/Panel', module)
  .add('default', () => (
    <Panel
      menuItems={[
        {
          title: 'Local files',
          iconName: 'file',
        },
      ]}
      filesCount={10} />
  ))
