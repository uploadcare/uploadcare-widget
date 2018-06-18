/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Input.css'

type Props = {
  className?: string,
}

export const Input = ({className}: Props) => (
  <input class={cn(styles.input, className)} />
)
