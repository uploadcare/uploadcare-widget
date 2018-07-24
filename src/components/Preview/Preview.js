/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Preview.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const Preview = ({className}: Props, children: Array<Children>) => (
  <div className={cn(styles.preview, className)}>
    {children}
  </div>
)
