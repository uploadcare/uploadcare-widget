/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Preview.css'

type Props = {
  className?: string,
}

export const Preview = ({className}: Props) => (
  <div class={cn(styles.Preview, className)}>
  </div>
)

