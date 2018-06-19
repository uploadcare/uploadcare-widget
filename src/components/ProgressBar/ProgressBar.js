/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import st from './ProgressBar.css'

type Props = {
  className?: string,
}

export const ProgressBar = ({className}: Props, children) => (
  <div className={cn(st.progressbar, className)}>
    <div className={st.progressbar__value}>{children}</div>
  </div>
)

