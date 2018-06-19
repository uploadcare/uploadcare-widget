/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Panel.css'

type Props = {
  className?: string,
  href: string,
  target?: string,
}

export const Panel = ({className}: Props, children) => (
  <div class={cn(styles.panel, className)}>
    {children}
  </div>
)

