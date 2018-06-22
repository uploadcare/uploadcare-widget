/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Files.css'

import type {Props} from './flow-typed'

export const Files = ({className}: Props, children: Children) => (
  <div className={cn(styles.files, className)}>
    {children}
  </div>
)
