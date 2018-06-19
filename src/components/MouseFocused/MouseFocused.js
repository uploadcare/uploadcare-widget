/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import styles from './MouseFocused.css'

export const MouseFocused = (children) => (
  <div class={styles['mouse-focused']}>
    {children}
  </div>
)

