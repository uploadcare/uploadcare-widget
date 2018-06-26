/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './DragAndDropSupported.css'

import type {Props} from './flow-typed'

export const DragAndDropSupported = ({className}: Props, children: Children) => (
  <div className={cn(
    styles.draganddrop__supported,
    className
  )}>
    {children}
  </div>
)
