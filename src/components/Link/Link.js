/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Link.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const Link = ({className, href, target}: Props, children: Array<Children>) => (
  <a
    className={cn(styles.link, className)}
    href={href}
    target={target}>{children}</a>
)

export const LinkDiv = ({className}: {className?: string}, children: Array<Children>) => (
  <div
    className={cn(styles.link, className)}
    tabIndex='0'
    role='link'>{children}</div>
)
