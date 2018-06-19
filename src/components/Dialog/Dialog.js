/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Dialog.css'

type Props = {
  className?: string,
}

export const Dialog = ({className}: Props) => (
  <div class={cn(styles.dialog, className)}>
  </div>
)

