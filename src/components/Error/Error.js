/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Error.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const Error = ({className}: Props, children: Array<Children>) => (
  <div className={cn(styles.error, className)}>
    {children}
  </div>
)
