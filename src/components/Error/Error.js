/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import st from './Error.css'

type Props = {
  className?: string,
}

export const Error = ({className}: Props, children) => (
  <div className={cn(st.error, className)}>
    {children}
  </div>
)

