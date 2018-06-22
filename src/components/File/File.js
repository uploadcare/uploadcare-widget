/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './File.css'

import type {Props} from './flow-typed'

export const File = ({className}: Props, children: Children) => (
  <div className={cn(styles.file, className)}>
    {children}
  </div>
)
