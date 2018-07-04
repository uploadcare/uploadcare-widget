/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './DraggingShow.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const DraggingShow = ({className}: Props, children: Array<Children>) => (
  <div className={cn(
    styles.dragging__show,
    className
  )}>
    {children}
  </div>
)
