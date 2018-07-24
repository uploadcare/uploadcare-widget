/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import styles from './MouseFocused.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const MouseFocused = ({}: Props, children: Array<Children>) => (
  <div class={styles['mouse-focused']}>
    {children}
  </div>
)

