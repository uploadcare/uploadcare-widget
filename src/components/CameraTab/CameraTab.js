/* @flow */
/* @jsx h */
import {h} from 'hyperapp'

import {translate} from '../../helpers'

import {TabContent} from '../Tab/components/TabContent/TabContent'
import {TabTitle} from '../Tab/components/TabTitle/TabTitle'
import {Text} from '../Text/Text'
import {Camera} from './components/Camera/Camera'

import type {Props} from './flow-typed'

export const CameraTab = ({className}: Props) => (
  <TabContent className={className}>
    <TabTitle>
      <Text size='large'>
        {translate('dialog.tabs.camera.title')}
      </Text>
    </TabTitle>
    <Camera />
  </TabContent>
)
