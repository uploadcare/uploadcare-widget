/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Footer.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const Footer = ({className}: Props, children: Array<Children>) => (
  <div class={cn(styles.footer, className)}>
    {children}
  </div>
)
