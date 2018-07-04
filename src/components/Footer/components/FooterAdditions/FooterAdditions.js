/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './FooterAdditions.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const FooterAdditions = ({className}: Props, children: Array<Children>) => (
  <div class={cn(styles.footer__additions, className)}>
    {children}
  </div>
)
