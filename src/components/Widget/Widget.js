/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Widget.css'

import type {Props} from './flow-typed'

export const Widget = ({className}: Props, children) => (
  <div className={cn(styles.widget, className)}>
    {children}
  </div>
)
