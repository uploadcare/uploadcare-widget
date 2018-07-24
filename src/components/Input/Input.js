/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Input.css'

import type {Props} from './flow-typed'

export const Input = ({className, type = 'text', placeholder}: Props) => (
  <input
    class={cn(styles.input, className)}
    type={type}
    placeholder={placeholder} />
)
