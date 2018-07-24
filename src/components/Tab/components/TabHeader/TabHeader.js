/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './TabHeader.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const TabHeader = ({className}: Props, children: Array<Children>) => (
  <div className={cn(styles.tab__header, className)}>
    {children}
  </div>
)
