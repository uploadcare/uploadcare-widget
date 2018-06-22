/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import styles from './MouseFocused.css'

import type {Props} from './flow-typed'

export const MouseFocused = ({}: Props, children: Children) => (
  <div class={styles['mouse-focused']}>
    {children}
  </div>
)

