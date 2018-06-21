/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Panel.css'

import type {Props} from './flow-typed'

export const Panel = ({className}: Props, children) => (
  <div class={cn(styles.panel, className)}>
    {children}
  </div>
)
