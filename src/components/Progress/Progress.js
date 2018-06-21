/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Progress.css'

import type {Props} from './flow-typed'

export const Progress = ({className}: Props) => (
  <div class={cn(styles.progress__container, className)}>
    <div class={styles.progress__text}></div>
  </div>
)
