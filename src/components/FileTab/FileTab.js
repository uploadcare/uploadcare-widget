/* @flow */
/* @jsx h */
import {h} from 'hyperapp'

import {TabContent} from '../Tab/components/TabContent/TabContent'

import type {Props} from './flow-typed'

export const FileTab = ({className}: Props) => (
  <TabContent className={className} />
)
