/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './DraggingHide.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const DraggingHide = ({className}: Props, children: Array<Children>) => (
  <div className={cn(
    styles.dragging__hide,
    className
  )}>
    {children}
  </div>
)
