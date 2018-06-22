/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Footer.css'

import type {Props} from './flow-typed'

export const Footer = ({className}: Props, children: Children) => (
  <div class={cn(styles.footer, className)}>
    {children}
  </div>
)
