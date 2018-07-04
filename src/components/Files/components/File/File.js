/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './File.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const File = ({className}: Props, children: Array<Children>) => (
  <div className={cn(styles.file, className)}>
    {children}
  </div>
)
