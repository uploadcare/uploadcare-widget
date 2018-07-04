/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Files.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const Files = ({className}: Props, children: Array<Children>) => (
  <div className={cn(styles.files, className)}>
    {children}
  </div>
)
