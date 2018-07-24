/* @flow */
/* @jsx h */
import {h} from 'hyperapp'

import {translate} from '../../helpers'

import {TabContent} from '../Tab/components/TabContent/TabContent'
import {TabTitle} from '../Tab/components/TabTitle/TabTitle'
import {Camera} from './components/Camera/Camera'

import type {Props} from './flow-typed'

export const CameraTab = ({className}: Props) => (
  <TabContent className={className}>
    <TabTitle>
      {translate('dialog.tabs.camera.title')}
    </TabTitle>
    <Camera />
  </TabContent>
)
