/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './DraggingShow.css'

import type {Props} from './flow-typed'

export const DraggingShow = ({className}: Props, children: Children) => (
  <div className={cn(
    styles.dragging__show,
    className
  )}>
    {children}
  </div>
)
