/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Link.css'

import type {Props} from './flow-typed'

export const Link = ({className, href, target}: Props, children) => (
  <a
    className={cn(styles.link, className)}
    href={href}
    target={target}>{children}</a>
)
