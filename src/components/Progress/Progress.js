/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import st from './Progress.css'

type Props = {
  className?: string,
}

export const Progress = ({className}: Props) => (
  <div class={cn(st.progress__container, className)}>
    <div class={st.progress__text}></div>
  </div>
)

