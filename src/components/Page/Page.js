/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Page.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const Page = ({className}: Props, children: Array<Children>) => (
  <div class={cn(styles.page, className)}>
    {children}
  </div>
)
