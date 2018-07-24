/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './ProgressBar.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const ProgressBar = ({className}: Props, children: Array<Children>) => (
  <div class={cn(styles.progressbar, className)}>
    <div class={styles.progressbar__value}>{children}</div>
  </div>
)
