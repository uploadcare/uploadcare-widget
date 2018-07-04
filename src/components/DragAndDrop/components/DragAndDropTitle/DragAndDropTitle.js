/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './DragAndDropTitle.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const DragAndDropTitle = ({className}: Props, children: Array<Children>) => (
  <div className={cn(
    styles.draganddrop__title,
    className
  )}>
    {children}
  </div>
)
