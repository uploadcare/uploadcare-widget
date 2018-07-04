/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './TabTitle.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const TabTitle = ({className}: Props, children: Array<Children>) => (
  <div className={cn(styles.tab__title, className)}>
    {children}
  </div>
)
