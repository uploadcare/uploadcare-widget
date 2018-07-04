/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './DragAndDropNotSupported.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const DragAndDropNotSupported = ({className}: Props, children: Array<Children>) => (
  <div className={cn(
    styles['draganddrop__not-supported'],
    className
  )}>
    {children}
  </div>
)
