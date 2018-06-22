/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './ProgressBar.css'

import type {Props} from './flow-typed'

export const ProgressBar = ({className}: Props, children: Children) => (
  <div class={cn(styles.progressbar, className)}>
    <div class={styles.progressbar__value}>{children}</div>
  </div>
)
