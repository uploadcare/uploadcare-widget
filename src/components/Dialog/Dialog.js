/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Dialog.css'

import type {Props} from './flow-typed'

export const Dialog = ({className}: Props, children: Children) => (
  <div class={cn(styles.dialog, className)}>
    {children}
  </div>
)
