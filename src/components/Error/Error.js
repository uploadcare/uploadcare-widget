/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Error.css'

import type {Props} from './flow-typed'

export const Error = ({className}: Props, children: Children) => (
  <div className={cn(styles.error, className)}>
    {children}
  </div>
)
