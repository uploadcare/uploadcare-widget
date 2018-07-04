/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Form.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const Form = ({className}: Props, children: Array<Children>) => (
  <form className={cn(styles.form, className)}>
    {children}
  </form>
)
