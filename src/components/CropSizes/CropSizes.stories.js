/* @jsx h */
import {h} from 'hyperapp'
import {storiesOf} from '@zmoki/storybook-hyperapp'
import {CropSizes} from './CropSizes'

storiesOf('Components/CropSizes', module)
  .add('default', () => (
    <CropSizes
      items={[
        {
          caption: 'free',
          withIcon: 'crop-free',
        },
        {caption: '1:1'},
        {caption: '4:3'},
        {caption: '16:9'},
      ]}>Default button</CropSizes>
  ))
