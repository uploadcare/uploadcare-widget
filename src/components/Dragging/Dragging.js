/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Dragging.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const Dragging = ({className}: Props, children: Array<Children>) => (
  <div className={cn(
    styles.dragging,
    className
  )}>
    {children}
  </div>
)
