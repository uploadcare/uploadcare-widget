/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Form.css'

import type {Props} from './flow-typed'

export const Form = ({className}: Props, children: Children) => (
  <form className={cn(styles.form, className)}>
    {children}
  </form>
)
