/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './PreviewTitle.css'

import {TabTitle} from '../../../Tab/components/TabTitle/TabTitle'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const PreviewTitle = ({className}: Props, children: Array<Children>) => (
  <TabTitle
    className={cn(styles.preview__title, className)}>
    {children}
  </TabTitle>
)
