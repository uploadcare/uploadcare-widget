/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Dragging.css'

import type {Props} from './flow-typed'

export const Dragging = ({className}: Props, children: Children) => (
  <div className={cn(
    styles.dragging,
    className
  )}>
    {children}
  </div>
)
