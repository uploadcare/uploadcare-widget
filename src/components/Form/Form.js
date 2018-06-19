/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Form.css'

type Props = {
  className?: string,
}

export const Form = ({className}: Props, children) => (
  <form className={cn(styles.form, className)}>
    {children}
  </form>
)

