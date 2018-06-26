/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './DragAndDrop.css'

import type {Props} from './flow-typed'

export const DragAndDrop = ({className}: Props, children: Children) => (
  <div className={cn(
    styles.draganddrop,
    className
  )}>
    {children}
  </div>
)
