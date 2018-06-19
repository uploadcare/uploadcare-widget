/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Icon.css'

type Props = {
  className?: string,
}

export const Icon = ({className}: Props, children) => (
  <svg
    role='presentation'
    width='32'
    height='32'
    class={cn(styles.icon, className)}>
    {children}
  </svg>
)

