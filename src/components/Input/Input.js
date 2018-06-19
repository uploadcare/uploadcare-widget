/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Input.css'

type Props = {
  className?: string,
  type?: string,
}

export const Input = ({className, type}: Props) => (
  <input
    class={cn(styles.input, className)}
    type={type} />
)
