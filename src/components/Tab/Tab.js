/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Tab.css'

import type {Props} from './flow-typed'

export const Tab = ({className}: Props, children) => (
  <div className={cn(styles.tab, className)}>
    {children}
  </div>
)
