/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Link.css'

type Props = {
  className?: string,
  href: string,
  target?: string,
}

export const Link = ({className, href, target}: Props, children) => (
  <a
    className={cn(styles.link, className)}
    href={href}
    target={target}>{children}</a>
)

