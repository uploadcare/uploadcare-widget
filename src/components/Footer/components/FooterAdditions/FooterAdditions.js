/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './FooterAdditions.css'

import type {Props} from './flow-typed'

export const FooterAdditions = ({className}: Props, children) => (
  <div class={cn(styles.footer__additions, className)}>
    {children}
  </div>
)
