/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import st from './Form.css'

type Props = {
  className?: string,
}

export const Form = ({className}: Props, children) => (
  <form className={cn(st.form, className)}>
    {children}
  </form>
)

