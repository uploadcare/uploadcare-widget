/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './TabContent.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const TabContent = ({className}: Props, children: Array<Children>) => (
  <div className={cn(styles.tab__content, className)}>
    {children}
  </div>
)
